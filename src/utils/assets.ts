// Asset Resolver with case-insensitive and filename mapping for AI Studio assets

// Use Vite's import.meta.glob to dynamically bundle and resolve all asset URLs at build time
const globAssets = import.meta.glob<{ default: string }>('/assets/*', {
  eager: true,
  import: 'default',
});

// Map of filename (and lowercased filename) to resolved URL
const assetUrlMap: Record<string, string> = {};

for (const path in globAssets) {
  const url = globAssets[path] as unknown as string;
  // path is e.g. "/assets/python剪影.PNG"
  const filename = path.split('/').pop() || '';
  if (filename) {
    assetUrlMap[filename] = url;
    assetUrlMap[filename.toLowerCase()] = url;
    // Also store base name without extension
    const baseName = filename.toLowerCase().replace(/\.[^/.]+$/, '');
    if (!assetUrlMap[baseName]) {
      assetUrlMap[baseName] = url;
    }
  }
}

export function resolveAssetPath(name: string): string {
  if (!name) return '';
  const cleanName = name.trim();

  // 1. Direct match in glob map
  if (assetUrlMap[cleanName]) {
    return assetUrlMap[cleanName];
  }

  // 2. Case-insensitive match in glob map
  const lowerInput = cleanName.toLowerCase();
  if (assetUrlMap[lowerInput]) {
    return assetUrlMap[lowerInput];
  }

  // 3. Base name match ignoring extension differences (.png vs .PNG vs .m4a)
  const baseInput = lowerInput.replace(/\.[^/.]+$/, '');
  if (assetUrlMap[baseInput]) {
    return assetUrlMap[baseInput];
  }

  // 4. Fallback aliases
  if (cleanName.includes('抽取扭蛋畫面') || cleanName.includes('出抽出扭蛋畫面')) {
    if (assetUrlMap['抽取扭蛋畫面.PNG']) return assetUrlMap['抽取扭蛋畫面.PNG'];
    if (assetUrlMap['抽取扭蛋畫面.png']) return assetUrlMap['抽取扭蛋畫面.png'];
  }

  // Fallback to relative URL
  return `/assets/${cleanName}`;
}

