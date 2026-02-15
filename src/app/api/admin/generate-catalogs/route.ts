import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST() {
  try {
    const projectRoot = process.cwd();
    const command = 'npm run generate:catalogs';

    console.log('🔄 Génération des catalogues statiques...');
    
    const { stdout, stderr } = await execAsync(command, {
      cwd: projectRoot,
      timeout: 30000, // 30 secondes max
    });

    console.log('✅ Catalogues générés avec succès');
    
    // Lire les informations de génération
    const catalogToilesPath = path.join(projectRoot, 'src/lib/catalog-toiles.ts');
    const catalogCouleursPath = path.join(projectRoot, 'src/lib/catalog-couleurs.ts');
    
    return NextResponse.json({
      success: true,
      message: 'Catalogues générés avec succès',
      timestamp: new Date().toISOString(),
      output: {
        stdout: stdout || 'Génération terminée',
        stderr: stderr || '',
      },
      files: [
        'src/lib/catalog-toiles.ts',
        'src/lib/catalog-couleurs.ts',
      ]
    });

  } catch (error: any) {
    console.error('❌ Erreur génération catalogues:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stderr || error.stdout,
    }, { status: 500 });
  }
}
