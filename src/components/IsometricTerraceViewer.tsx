'use client';

import React, { useState, useEffect } from 'react';

interface TerraceState {
  m1: number; // Largeur du mur du haut (mètres)
  m2: number; // Hauteur/avancée côté gauche (mètres)
  m3: number; // Largeur du mur du bas (mètres)
  m4: number; // Hauteur/avancée côté droit (mètres)
}

interface IsometricViewProps {
  terrace: TerraceState;
  storeWidth?: number; // Largeur proposée du store (M1 ou moyenne)
  storeDepth?: number; // Profondeur/avancée proposée (M2 ou moyenne)
  onDeploymentChange?: (deployed: boolean) => void;
  diagnosticMode?: boolean; // Afficher les zones critiques
  wallMountHeight?: number; // Hauteur de pose (par défaut 2.6m)
}

// Utilitaires de projection isométrique
const isometricProjection = (x: number, y: number, z: number, rotation: number = 0) => {
  // Appliquer la rotation autour du point d'origine
  const rad = (rotation * Math.PI) / 180;
  const rotatedX = x * Math.cos(rad) - y * Math.sin(rad);
  const rotatedY = x * Math.sin(rad) + y * Math.cos(rad);
  
  // Projection isométrique simplifiée : angles de 30° et 30°
  const isoX = rotatedX - rotatedY * 0.866; // cos(30°)
  const isoY = (rotatedX + rotatedY) * 0.5 - z; // Élévation verticale pour Z
  return { isoX, isoY };
};

// Projection EN 3D avec rotation autour de l'AXE Z VERTICAL (verticalement)
const isometricProjectionWithCenterRotation = (
  x: number,
  y: number,
  z: number,
  centerX: number,
  centerY: number,
  rotation: number,
  verticalTilt: number = 0
) => {
  // Translater au centre de rotation (dans le plan XY uniquement)
  const x0 = x - centerX;
  const y0 = y - centerY;
  const z0 = z;
  
  // 1. Appliquer la rotation VERTICALE (tilt autour de l'axe X)
  // Cela modifie Y et Z
  const tiltRad = (verticalTilt * Math.PI) / 180;
  const tiltedY = y0 * Math.cos(tiltRad) - z0 * Math.sin(tiltRad);
  const tiltedZ = y0 * Math.sin(tiltRad) + z0 * Math.cos(tiltRad);
  
  // 2. Appliquer la rotation HORIZONTALE (autour de l'axe Z)
  // Cela préserve Z tiltée, donc les points à la même hauteur restent à la même hauteur
  const rad = (rotation * Math.PI) / 180;
  const rotatedX = x0 * Math.cos(rad) - tiltedY * Math.sin(rad);
  const rotatedY = x0 * Math.sin(rad) + tiltedY * Math.cos(rad);
  
  // Translater de retour
  const finalX = rotatedX + centerX;
  const finalY = rotatedY + centerY;
  
  // Projection isométrique (Z est maintenant tiltée)
  const isoX = finalX - finalY * 0.866;
  const isoY = (finalX + finalY) * 0.5 - tiltedZ;
  return { isoX, isoY };

};

const TerraceVisualizerIsometric: React.FC<IsometricViewProps> = ({
  terrace,
  storeWidth,
  storeDepth,
  onDeploymentChange,
  diagnosticMode = false,
  wallMountHeight = 2.6,
}) => {
  const [isDeployed, setIsDeployed] = useState(true); // Toile déployée par défaut
  const [animationProgress, setAnimationProgress] = useState(1); // Complètement déployée (1 = 100%)
  const [rotation, setRotation] = useState(315); // Fixé à 315° pour voir le coffre bien positionné
  const [verticalTilt, setVerticalTilt] = useState(0); // Inclinaison verticale (-30° à +30°)
  const [offsetX, setOffsetX] = useState(-50); // Recentrage après rotation 315°
  const [offsetY, setOffsetY] = useState(50); // Recentrage après rotation 315°
  const [criticalZoneInfo, setCriticalZoneInfo] = useState<{
    isCritical: boolean;
    message: string;
    severity: 'safe' | 'warning' | 'critical';
  } | null>(null);

  // Animation fluide du déploiement
  useEffect(() => {
    let frame: number;
    if (isDeployed && animationProgress < 1) {
      frame = requestAnimationFrame(() => {
        setAnimationProgress((prev) => Math.min(prev + 0.05, 1));
      });
    } else if (!isDeployed && animationProgress > 0) {
      frame = requestAnimationFrame(() => {
        setAnimationProgress((prev) => Math.max(prev - 0.05, 0));
      });
    }
    return () => cancelAnimationFrame(frame);
  }, [isDeployed, animationProgress]);

  // Callback pour le déploiement
  useEffect(() => {
    onDeploymentChange?.(isDeployed);
  }, [isDeployed, onDeploymentChange]);

  // Analyse diagnostic : détection de zones critiques
  useEffect(() => {
    if (!diagnosticMode || !storeDepth) return;

    const effectiveDepth = storeDepth * animationProgress;
    const mountHeight = wallMountHeight; // 2.6m par défaut
    const safeDepth = mountHeight * 0.6; // Règle : profondeur max = 60% de la hauteur de pose

    if (effectiveDepth > safeDepth) {
      const ratio = (effectiveDepth / safeDepth) * 100;
      setCriticalZoneInfo({
        isCritical: true,
        message: `⚠️ Risque d'inclinaison excessive (${ratio.toFixed(0)}% de la limite)`,
        severity: ratio > 120 ? 'critical' : 'warning',
      });
    } else {
      setCriticalZoneInfo({
        isCritical: false,
        message: '✅ Configuration sécurisée',
        severity: 'safe',
      });
    }
  }, [animationProgress, storeDepth, diagnosticMode, wallMountHeight]);

  // Paramètres de rendu
  const pixelsPerMeter = 80;
  const groundY = 300; // Y de la ligne du sol dans le SVG
  
  // Dimensions du sol (trapèze en vue isométrique)
  const m1_px = terrace.m1 * pixelsPerMeter;
  const m2_px = terrace.m2 * pixelsPerMeter;
  const m3_px = terrace.m3 * pixelsPerMeter;
  const m4_px = terrace.m4 * pixelsPerMeter;

  // Centre 3D du trapèze du sol (pour rotation cohérente)
  const centerX3D = (m1_px + m3_px) / 4;
  const centerY3D = (m2_px + m4_px) / 4;

  // Mur de façade (M4) - c'est là où le store est fixé
  const facadeHeight_px = wallMountHeight * pixelsPerMeter; // 2.6m = hauteur du mur

  // Calcul des points du sol en perspective isométrique
  // Le trapèze au sol vu d'en haut
  const groundDepth = (terrace.m2 + terrace.m4) / 2;
  const groundWidth = (terrace.m1 + terrace.m3) / 2;

  // Point A: coin avant gauche du sol (M2 et M1 impliqués)
  const pointA_iso = isometricProjectionWithCenterRotation(0, 0, 0, centerX3D, centerY3D, rotation, verticalTilt);
  
  // Point B: coin avant droit
  const pointB_iso = isometricProjectionWithCenterRotation(m1_px, 0, 0, centerX3D, centerY3D, rotation, verticalTilt);
  
  // Point C: coin arrière droit
  const pointC_iso = isometricProjectionWithCenterRotation(m3_px, m2_px, 0, centerX3D, centerY3D, rotation, verticalTilt); // M2 = profondeur
  
  // Point D: coin arrière gauche
  const pointD_iso = isometricProjectionWithCenterRotation(0, m4_px, 0, centerX3D, centerY3D, rotation, verticalTilt); // M4 = profondeur côté gauche

  // Mur de façade AVANT (M1) - où le store est fixé
  // Calculer les points du haut du mur avec projection isométrique pour cohérence avec la toile
  const wallFrontTopLeft = isometricProjectionWithCenterRotation(0, 0, wallMountHeight * pixelsPerMeter, centerX3D, centerY3D, rotation, verticalTilt);
  const wallFrontTopRight = isometricProjectionWithCenterRotation(m1_px, 0, wallMountHeight * pixelsPerMeter, centerX3D, centerY3D, rotation, verticalTilt);
  
  // Mur de façade ARRIÈRE (optionnel, pour la visualisation)
  const wallBackTopLeft = {
    isoX: pointD_iso.isoX,
    isoY: pointD_iso.isoY - facadeHeight_px,
  };
  
  const wallBackTopRight = {
    isoX: pointC_iso.isoX,
    isoY: pointC_iso.isoY - facadeHeight_px,
  };

  // Simulation du store : TOILE SIMPLE
  // La toile s'étend à partir du mur M1 vers l'intérieur de la terrasse
  const toileWidth = (m1_px + m3_px) / 2; // Largeur moyenne
  const coffeeCenterX3D = m1_px / 2; // Centre du mur M1 en 3D (X)
  
  // Déploiement : distance vers l'intérieur (M2)
  const armDeploymentDistance = (storeDepth || (terrace.m2 + terrace.m4) / 2) * pixelsPerMeter * animationProgress;

  // Pas besoin de précalculer shadowPoints car ils sont calculés dynamiquement dans le rendu

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 600;
  
  // Déplacement direct du viewport en pixels
  const centerX = svgWidth / 2 + offsetX;
  const centerY = groundY + offsetY;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* En-tête */}
      <div className="px-4 pt-4">
        <h3 className="text-lg font-bold text-gray-900">Vue Isométrique 3D</h3>
        <p className="text-xs text-gray-500">Plan d'architecte - Simulation en temps réel</p>
      </div>

      {/* Contrôles de rotation et panoramique */}
      <div className="px-4 flex gap-3 justify-center items-center flex-wrap">
        {/* Rotation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setRotation((r) => (r - 15 + 360) % 360)}
            className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition text-lg"
            title="Rotation gauche"
          >
            ↶
          </button>
          <span className="text-xs text-gray-600">{rotation}°</span>
          <button
            onClick={() => setRotation((r) => (r + 15) % 360)}
            className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition text-lg"
            title="Rotation droite"
          >
            ↷
          </button>
        </div>

        {/* Tilt vertical */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setVerticalTilt((t) => Math.min(t + 10, 30))}
            className="p-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition text-lg"
            title="Incliner vers le haut"
          >
            ⛰️
          </button>
          <span className="text-xs text-gray-600">{verticalTilt}°</span>
          <button
            onClick={() => setVerticalTilt((t) => Math.max(t - 10, -30))}
            className="p-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition text-lg"
            title="Incliner vers le bas"
          >
            ⬇️
          </button>
        </div>

        {/* Pan vertical */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOffsetY((o) => o + 15)}
            className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition text-lg"
            title="Panoramique vers le haut"
          >
            ⬆
          </button>
          <span className="text-xs text-gray-600 whitespace-nowrap">Pan</span>
          <button
            onClick={() => setOffsetY((o) => o - 15)}
            className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition text-lg"
            title="Panoramique vers le bas"
          >
            ⬇
          </button>
        </div>

        {/* Pan horizontal */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOffsetX((o) => o + 15)}
            className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition text-lg"
            title="Panoramique vers la gauche"
          >
            ⬅
          </button>
          <span className="text-xs text-gray-600 whitespace-nowrap">X:{offsetX} Y:{offsetY}</span>
          <button
            onClick={() => setOffsetX((o) => o - 15)}
            className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition text-lg"
            title="Panoramique vers la droite"
          >
            ➡
          </button>
        </div>
      </div>

      <div className="px-4">
        <button
          onClick={() => {
            setRotation(0);
            setVerticalTilt(0);
            setOffsetX(0);
            setOffsetY(0);
          }}
          className="w-full px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition"
        >
          Réinitialiser la vue
        </button>
      </div>

      {/* Visualisation SVG */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg mx-4 overflow-hidden relative">
        {/* Bouton de déploiement - Positionnement absolu en haut à droite */}
        <button
          onClick={() => setIsDeployed(!isDeployed)}
          className={`absolute top-4 right-4 px-4 py-2 rounded-lg font-semibold transition-all z-20 ${
            isDeployed
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isDeployed ? '⬅️ Rentrer' : '➡️ Ouvrir'}
        </button>

        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="border border-gray-300 bg-white"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
        >
          <defs>
            {/* Dégradés */}
            <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8e8e8" stopOpacity="1" />
              <stop offset="100%" stopColor="#d0d0d0" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="wallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f5f5f5" stopOpacity="1" />
              <stop offset="100%" stopColor="#e0e0e0" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="canvasGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e40af" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#1e3a8a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.75" />
            </linearGradient>

            <filter id="shadowFilter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.4" />
              </feComponentTransfer>
            </filter>

            {/* Pattern pour le sol */}
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ddd" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* SOL - Trapèze isométrique */}
          <polygon
            points={`${centerX + pointA_iso.isoX},${centerY + pointA_iso.isoY} ${centerX + pointB_iso.isoX},${centerY + pointB_iso.isoY} ${centerX + pointC_iso.isoX},${centerY + pointC_iso.isoY} ${centerX + pointD_iso.isoX},${centerY + pointD_iso.isoY}`}
            fill="url(#groundGradient)"
            stroke="#888"
            strokeWidth="1.5"
            opacity="0.9"
          />

          {/* Contours des murs au sol */}
          <line
            x1={centerX + pointA_iso.isoX}
            y1={centerY + pointA_iso.isoY}
            x2={centerX + pointB_iso.isoX}
            y2={centerY + pointB_iso.isoY}
            stroke="#666"
            strokeWidth="2"
          />
          <line
            x1={centerX + pointB_iso.isoX}
            y1={centerY + pointB_iso.isoY}
            x2={centerX + pointC_iso.isoX}
            y2={centerY + pointC_iso.isoY}
            stroke="#666"
            strokeWidth="2"
          />
          <line
            x1={centerX + pointC_iso.isoX}
            y1={centerY + pointC_iso.isoY}
            x2={centerX + pointD_iso.isoX}
            y2={centerY + pointD_iso.isoY}
            stroke="#666"
            strokeWidth="2"
          />
          <line
            x1={centerX + pointD_iso.isoX}
            y1={centerY + pointD_iso.isoY}
            x2={centerX + pointA_iso.isoX}
            y2={centerY + pointA_iso.isoY}
            stroke="#666"
            strokeWidth="2"
          />

          {/* MUR DE FAÇADE - Avant (M1) - où le store est fixé */}
          <polygon
            points={`${centerX + pointA_iso.isoX},${centerY + pointA_iso.isoY} ${centerX + pointB_iso.isoX},${centerY + pointB_iso.isoY} ${centerX + wallFrontTopRight.isoX},${centerY + wallFrontTopRight.isoY} ${centerX + wallFrontTopLeft.isoX},${centerY + wallFrontTopLeft.isoY}`}
            fill="url(#wallGradient)"
            stroke="#666"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* STORE - Toile s'enroulant/déroulant (textile, parallèle à M1-M3) */}
          {animationProgress > 0.05 && (
            <g>
              {(() => {
                // Toile partiellement déroulée - S'étend vers l'INTÉRIEUR de la terrasse (Y positif)
                const visibleRatio = animationProgress;
                
                // La toile s'étend parallèle à M1-M3 (largeur du haut et bas du trapèze)
                // Longueur : de M1 à M3 (largeur moyenne)
                const toileWidth = (m1_px + m3_px) / 2; // Largeur moyenne
                
                // Longueur : du coffre jusqu'où le bras est sorti
                const toileLength = armDeploymentDistance;
                
                // PARALLÉLÉPIPÈDE RECTANGLE
                // Un seul rectangle à la hauteur du store (Z=wallMountHeight)
                const toileZ = wallMountHeight * pixelsPerMeter;
                
                const p1_bas = isometricProjectionWithCenterRotation(
                  coffeeCenterX3D - toileWidth / 2,
                  0,
                  toileZ,  // Z = hauteur du coffre (2.6m)
                  centerX3D,
                  centerY3D,
                  rotation,
                  verticalTilt
                );
                const p2_bas = isometricProjectionWithCenterRotation(
                  coffeeCenterX3D + toileWidth / 2,
                  0,
                  toileZ,  // Z = hauteur du coffre (2.6m)
                  centerX3D,
                  centerY3D,
                  rotation,
                  verticalTilt
                );
                const p3_bas = isometricProjectionWithCenterRotation(
                  coffeeCenterX3D + toileWidth / 2,
                  toileLength,
                  toileZ,  // Z = hauteur du coffre (2.6m)
                  centerX3D,
                  centerY3D,
                  rotation,
                  verticalTilt
                );
                const p4_bas = isometricProjectionWithCenterRotation(
                  coffeeCenterX3D - toileWidth / 2,
                  toileLength,
                  toileZ,  // Z = hauteur du coffre (2.6m)
                  centerX3D,
                  centerY3D,
                  rotation,
                  verticalTilt
                );
                
                return (
                  <>
                    {/* Rectangle de toile déployée à la hauteur du coffre */}
                    <polygon
                      points={`
                        ${centerX + p1_bas.isoX},${centerY + p1_bas.isoY}
                        ${centerX + p2_bas.isoX},${centerY + p2_bas.isoY}
                        ${centerX + p3_bas.isoX},${centerY + p3_bas.isoY}
                        ${centerX + p4_bas.isoX},${centerY + p4_bas.isoY}
                      `}
                      fill="url(#canvasGradient)"
                      stroke="#1e3a8a"
                      strokeWidth="1.5"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                    />
                    
                    {/* Plis visuels sur la toile */}
                    {visibleRatio < 0.8 && (
                      <>
                        {[0.3, 0.6].map((ratio) => (
                          <line
                            key={ratio}
                            x1={centerX + p1_bas.isoX + (p4_bas.isoX - p1_bas.isoX) * ratio}
                            y1={centerY + p1_bas.isoY + (p4_bas.isoY - p1_bas.isoY) * ratio}
                            x2={centerX + p2_bas.isoX + (p3_bas.isoX - p2_bas.isoX) * ratio}
                            y2={centerY + p2_bas.isoY + (p3_bas.isoY - p2_bas.isoY) * ratio}
                            stroke="#163a8c"
                            strokeWidth="0.5"
                            opacity={0.5}
                          />
                        ))}
                      </>
                    )}
                  </>
                );
              })()}
            </g>
          )}

          {/* OMBRE PORTÉE au sol - Projection de la toile sur le sol */}
          {animationProgress > 0 && (
            (() => {
              const toileLength = armDeploymentDistance;
              
              // Coins de l'ombre au sol (CENTRÉS sur le mur M1)
              const shadowTLIso = isometricProjectionWithCenterRotation(coffeeCenterX3D - toileWidth / 2, 0, 0, centerX3D, centerY3D, rotation, verticalTilt);
              const shadowTRIso = isometricProjectionWithCenterRotation(coffeeCenterX3D + toileWidth / 2, 0, 0, centerX3D, centerY3D, rotation, verticalTilt);
              const shadowBRIso = isometricProjectionWithCenterRotation(coffeeCenterX3D + toileWidth / 2, toileLength, 0, centerX3D, centerY3D, rotation, verticalTilt);
              const shadowBLIso = isometricProjectionWithCenterRotation(coffeeCenterX3D - toileWidth / 2, toileLength, 0, centerX3D, centerY3D, rotation, verticalTilt);
              
              return (
                <polygon
                  points={`
                    ${centerX + shadowTLIso.isoX},${centerY + shadowTLIso.isoY}
                    ${centerX + shadowTRIso.isoX},${centerY + shadowTRIso.isoY}
                    ${centerX + shadowBRIso.isoX},${centerY + shadowBRIso.isoY}
                    ${centerX + shadowBLIso.isoX},${centerY + shadowBLIso.isoY}
                  `}
                  fill="#333"
                  fillOpacity={0.15 * animationProgress}
                  filter="url(#shadowFilter)"
                />
              );
            })()
          )}

          {/* ZONE CRITIQUE (si diagnostic activé et déployée) */}
          {diagnosticMode && animationProgress > 0 && criticalZoneInfo?.isCritical && (
            (() => {
              const toileLength = armDeploymentDistance;
              
              const shadowTLIso = isometricProjectionWithCenterRotation(coffeeCenterX3D - toileWidth / 2, 0, 0, centerX3D, centerY3D, rotation, verticalTilt);
              const shadowBRIso = isometricProjectionWithCenterRotation(coffeeCenterX3D + toileWidth / 2, toileLength, 0, centerX3D, centerY3D, rotation, verticalTilt);
              
              return (
                <rect
                  x={centerX + shadowTLIso.isoX}
                  y={centerY + shadowBRIso.isoY}
                  width={shadowBRIso.isoX - shadowTLIso.isoX}
                  height={shadowTLIso.isoY - shadowBRIso.isoY}
                  fill={criticalZoneInfo.severity === 'critical' ? '#ef4444' : '#f97316'}
                  fillOpacity="0.2"
                  stroke={criticalZoneInfo.severity === 'critical' ? '#dc2626' : '#ea580c'}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })()
          )}

          {/* Annotations - Dimensions */}
          <text
            x={centerX + (pointA_iso.isoX + pointB_iso.isoX) / 2}
            y={centerY + pointA_iso.isoY + 25}
            textAnchor="middle"
            className="text-xs font-semibold fill-gray-700"
            fontSize="11"
          >
            M1: {terrace.m1.toFixed(2)}m
          </text>

          <text
            x={centerX + (pointD_iso.isoX + pointA_iso.isoX) / 2 - 30}
            y={centerY + (pointD_iso.isoY + pointA_iso.isoY) / 2}
            textAnchor="middle"
            className="text-xs font-semibold fill-gray-700"
            fontSize="11"
          >
            M4: {terrace.m4.toFixed(2)}m
          </text>

          {/* Hauteur du mur */}
          <line
            x1={centerX + wallFrontTopLeft.isoX - 40}
            y1={centerY + wallFrontTopLeft.isoY}
            x2={centerX + wallFrontTopLeft.isoX - 40}
            y2={centerY + pointA_iso.isoY}
            stroke="#666"
            strokeWidth="1"
            markerEnd="url(#arrowhead)"
          />
          <text
            x={centerX + wallFrontTopLeft.isoX - 50}
            y={centerY + (wallFrontTopLeft.isoY + pointA_iso.isoY) / 2}
            textAnchor="end"
            className="text-xs font-semibold fill-gray-700"
            fontSize="10"
          >
            {wallMountHeight.toFixed(2)}m
          </text>

          {/* Profondeur - Affiche l'avancée du store*/}

        </svg>
      </div>

      {/* Contrôles */}
      <div className="px-4 pb-4 space-y-3">
        {/* Diagnostic info */}
        {diagnosticMode && criticalZoneInfo && (
          <div
            className={`px-4 py-3 rounded-lg border text-sm ${
              criticalZoneInfo.severity === 'critical'
                ? 'bg-red-50 border-red-300 text-red-700'
                : criticalZoneInfo.severity === 'warning'
                  ? 'bg-orange-50 border-orange-300 text-orange-700'
                  : 'bg-green-50 border-green-300 text-green-700'
            }`}
          >
            {criticalZoneInfo.message}
          </div>
        )}

        {/* Infos d'animation */}
        <div className="text-xs text-gray-500 text-center">
          Déploiement: {Math.round(animationProgress * 100)}%
        </div>
      </div>
    </div>
  );
};

export default TerraceVisualizerIsometric;
