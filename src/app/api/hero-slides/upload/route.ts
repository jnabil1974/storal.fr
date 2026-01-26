import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slideId = formData.get('slideId') as string;

    if (!file || !slideId) {
      return NextResponse.json(
        { error: 'File and slideId required' },
        { status: 400 }
      );
    }

    // Upload image to Supabase storage
    const timestamp = Date.now();
    const fileName = `hero/${timestamp}-${file.name}`;
    const buffer = await file.arrayBuffer();

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('seo-images')
      .upload(fileName, buffer, { upsert: true, contentType: file.type });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('seo-images')
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData?.publicUrl;
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Failed to get public URL' },
        { status: 500 }
      );
    }

    // Update slide with new image URL
    const { data: slideData, error: updateError } = await supabase
      .from('hero_slides')
      .update({ image_url: imageUrl })
      .eq('id', parseInt(slideId))
      .select()
      .single();

    if (updateError) {
      console.error('Slide update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update slide' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      slide: slideData,
    });
  } catch (error: any) {
    console.error('Error in hero slides upload:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
