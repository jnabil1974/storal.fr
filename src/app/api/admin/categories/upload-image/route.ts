import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as 'category' | 'subcategory';
    const itemId = formData.get('itemId') as string;

    if (!file || !type || !itemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Upload to storage
    const fileName = `${type}/${itemId}/${Date.now()}-${file.name}`;
    const { data, error: uploadError } = await supabase.storage
      .from('seo-images')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('seo-images')
      .getPublicUrl(data.path);

    return NextResponse.json({ 
      url: publicUrl,
      path: data.path 
    });
  } catch (error) {
    console.error('Error uploading category image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
