import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toJpeg } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Download, Plus, Image as ImageIcon, Trash2, Square, Star, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ItemType = "image" | "video" | "text" | "logo" | "star" | "box";

interface CanvasItem {
  id: string;
  type: ItemType;
  content: string; // url for image, string for text
  x: number;
  y: number;
  width?: number;
  height?: number; // for box
  borderRadius?: number; // for box
  color?: string; // for text, box bg, and star mask
  fontFamily?: string;
  fontSize?: number;
  zIndex: number;
}

const BRAND_COLORS = [
  { name: "Paper", hex: "#fef8e1" },
  { name: "Peach", hex: "#e5815c" },
  { name: "Mocha", hex: "#5d4037" },
  { name: "Ocean Blue", hex: "#0077B6" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" }
];

const PRESET_IMAGES = [
  "/images/models/daydream/_HTM4179.JPEG",
  "/images/models/aquaglow/_HTM3828.JPEG",
  "/images/models/daydream/_HTM4610.JPEG",
  "/images/pieces/aqua-1.png",
  "/images/pieces/aqua-2.png",
  "/images/pieces/aqua-3.png",
  "/images/pieces/aqua-4.png",
  "/images/pieces/aqua-5.png"
];

export default function CreatorStudio() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [bgColor, setBgColor] = useState("#fef8e1");
  const [hasBorder, setHasBorder] = useState(true);
  const [format, setFormat] = useState<"post" | "story">("story");
  const [items, setItems] = useState<CanvasItem[]>([]);

  const canvasWidth = 1080;
  const canvasHeight = format === "story" ? 1920 : 1350;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (file.type.startsWith('video/')) {
      addItem("video", url);
    } else {
      addItem("image", url);
    }
  };
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addItem = (type: ItemType, content: string = "") => {
    const newItem: CanvasItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      x: 100,
      y: 100,
      zIndex: items.length + 1,
      width: type === "text" ? undefined : type === "box" ? 400 : type === "video" ? 600 : 300,
      height: type === "box" ? 200 : undefined,
      borderRadius: type === "box" ? 20 : 0,
      color: type === "text" || type === "star" ? "#000000" : type === "box" ? "#e5815c" : undefined,
      fontFamily: type === "text" ? "Fraunces" : undefined,
      fontSize: type === "text" ? 64 : undefined,
    };
    setItems([...items, newItem]);
    setSelectedId(newItem.id);
  };

  const updateItem = (id: string, updates: Partial<CanvasItem>) => {
    setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    setSelectedId(null);
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;
    try {
      // Temporarily remove selection outlines for export
      setSelectedId(null);
      
      // Give React a tick to clear the selection border
      setTimeout(async () => {
        const dataUrl = await toJpeg(canvasRef.current!, { quality: 1, width: 1080, height: canvasHeight });
        const link = document.createElement('a');
        link.download = 'moony-ad.jpg';
        link.href = dataUrl;
        link.click();
        toast({ title: "Ad Exported Successfully!" });
      }, 100);
    } catch (err) {
      console.error(err);
      toast({ title: "Export failed", variant: "destructive" });
    }
  };

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* LEFT SIDEBAR - TOOLS */}
      <div className="w-80 bg-white border-r p-6 overflow-y-auto shadow-sm z-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-black flex items-center justify-center rounded">
            <span className="text-white font-bold">M</span>
          </div>
          <h1 className="text-xl font-bold font-serif tracking-tight">Creator Studio</h1>
        </div>

        <div className="space-y-8">
          {/* Canvas Settings */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Canvas Settings</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Background Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {BRAND_COLORS.map(c => (
                    <button 
                      key={c.hex} 
                      onClick={() => setBgColor(c.hex)}
                      className={`w-8 h-8 rounded-full border-2 ${bgColor === c.hex ? 'border-black' : 'border-gray-200'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Format</Label>
                <div className="flex gap-2">
                  <Button variant={format === 'post' ? 'default' : 'outline'} size="sm" onClick={() => setFormat('post')}>4:5 Post</Button>
                  <Button variant={format === 'story' ? 'default' : 'outline'} size="sm" onClick={() => setFormat('story')}>9:16 TikTok</Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Website Style Frame</Label>
                <Switch checked={hasBorder} onCheckedChange={setHasBorder} />
              </div>
            </div>
          </div>

          {/* Add Elements */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Add Elements</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button onClick={() => addItem("text", "New Text")} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Text
              </Button>
              <Button onClick={() => addItem("logo", "/images/starfish-black.png")} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Logo Lockup
              </Button>
              <Button onClick={() => addItem("star", "/images/starfish-black.png")} variant="outline" className="w-full">
                <Star className="w-4 h-4 mr-2" /> Starfish
              </Button>
              <Button onClick={() => addItem("box")} variant="outline" className="w-full">
                <Square className="w-4 h-4 mr-2" /> Box
              </Button>
            </div>

            <div className="mb-6">
              <Button onClick={() => fileInputRef.current?.click()} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" /> Upload Media (Video/Image)
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
            </div>

            <Label className="mb-2 block">Image Library</Label>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 mb-4">
              {PRESET_IMAGES.map((src, i) => (
                <div 
                  key={i} 
                  onClick={() => addItem("image", src)}
                  className="aspect-square bg-gray-100 rounded cursor-pointer overflow-hidden border hover:border-black transition-colors"
                >
                  <img src={src} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <div className="pt-4 border-t">
            <Button onClick={handleExport} className="w-full bg-black text-white hover:bg-gray-800">
              <Download className="w-4 h-4 mr-2" /> Download JPG
            </Button>
          </div>
        </div>
      </div>

      {/* CENTER - CANVAS WORKSPACE */}
      <div className="flex-1 bg-gray-200 overflow-auto flex items-center justify-center p-8">
        <div style={{ transform: format === 'story' ? 'scale(0.45)' : 'scale(0.5)', transformOrigin: 'center center', padding: '24px' }}>
          
          <div 
            ref={canvasRef}
            className="relative shadow-2xl overflow-hidden transition-all duration-300"
            style={{ 
              width: '1080px', 
              height: `${canvasHeight}px`,
              backgroundColor: bgColor,
              border: hasBorder ? '8px solid black' : 'none',
              boxShadow: hasBorder ? '0 0 0 16px #e5815c, 0 20px 40px rgba(0,0,0,0.2)' : '0 20px 40px rgba(0,0,0,0.2)',
              borderRadius: hasBorder ? '48px' : '0px',
            }}
            onClick={(e) => { if(e.target === canvasRef.current) setSelectedId(null) }}
          >
            {/* Safe Zone Guide (Invisible on export) */}
            {hasBorder && selectedId && (
              <div className="absolute inset-[40px] border border-blue-200 border-dashed pointer-events-none opacity-50 z-0"></div>
            )}

            {items.map((item) => (
              <motion.div
                key={item.id}
                drag
                dragMomentum={false}
                onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
                onDragStart={() => setSelectedId(item.id)}
                style={{ 
                  position: 'absolute',
                  zIndex: item.zIndex,
                  cursor: 'grab',
                }}
                className={selectedId === item.id ? 'ring-2 ring-blue-500 ring-offset-4' : ''}
              >
                
                {/* TEXT */}
                {item.type === 'text' && (
                  <div 
                    style={{ 
                      fontFamily: item.fontFamily === 'Fraunces' ? "'Fraunces', serif" : item.fontFamily === 'Outfit' ? "'Outfit', sans-serif" : "'Noto Kufi Arabic', sans-serif",
                      fontSize: `${item.fontSize}px`,
                      color: item.color,
                      fontWeight: 900,
                      lineHeight: item.fontFamily === 'Fraunces' ? 1 : 1.2,
                      letterSpacing: item.fontFamily === 'Fraunces' ? '-0.04em' : 'normal',
                      direction: item.fontFamily === 'Noto Kufi Arabic' ? 'rtl' : 'ltr',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {item.content}
                  </div>
                )}
                
                {/* BOX */}
                {item.type === 'box' && (
                  <div style={{ 
                    width: `${item.width}px`, 
                    height: `${item.height}px`,
                    backgroundColor: item.color,
                    borderRadius: `${item.borderRadius}px`
                  }} />
                )}

                {/* IMAGE */}
                {item.type === 'image' && (
                  <img 
                    src={item.content} 
                    style={{ width: `${item.width}px`, pointerEvents: 'none', borderRadius: `${item.borderRadius || 0}px` }} 
                    alt="canvas element" 
                  />
                )}

                {/* VIDEO */}
                {item.type === 'video' && (
                  <video 
                    src={item.content} 
                    style={{ width: `${item.width}px`, pointerEvents: 'none', borderRadius: `${item.borderRadius || 0}px`, objectFit: 'cover' }} 
                    autoPlay loop muted playsInline
                  />
                )}

                {/* LOGO LOCKUP */}
                {item.type === 'logo' && (
                  <div className="flex items-center gap-3 pointer-events-none" style={{ color: item.color || '#000' }}>
                    <img src={item.content} style={{ width: `${item.width}px`, filter: item.color === '#ffffff' ? 'invert(1)' : 'none' }} />
                    <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: `${(item.width || 44) * 1.1}px`, letterSpacing: '-2px' }}>
                      moony
                    </span>
                  </div>
                )}

                {/* STANDALONE STARFISH */}
                {item.type === 'star' && (
                  <div style={{
                    width: `${item.width}px`,
                    height: `${item.width}px`,
                    backgroundColor: item.color,
                    WebkitMaskImage: `url(${item.content})`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskImage: `url(${item.content})`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    pointerEvents: 'none'
                  }} />
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* RIGHT SIDEBAR - SELECTED ITEM PROPERTIES */}
      <div className="w-80 bg-white border-l p-6 shadow-sm z-10 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Properties</h3>
        
        {!selectedItem ? (
          <div className="text-center text-gray-400 mt-20">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>Select an element to edit properties</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* TEXT CONTROLS */}
            {selectedItem.type === 'text' && (
              <>
                <div>
                  <Label className="mb-2 block">Text Content</Label>
                  <textarea 
                    className="w-full border p-2 rounded"
                    rows={3}
                    value={selectedItem.content}
                    onChange={(e) => updateItem(selectedItem.id, { content: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Font Family</Label>
                  <select 
                    className="w-full border p-2 rounded bg-white"
                    value={selectedItem.fontFamily}
                    onChange={(e) => updateItem(selectedItem.id, { fontFamily: e.target.value })}
                  >
                    <option value="Fraunces">Fraunces (English Serif)</option>
                    <option value="Outfit">Outfit (English Sans)</option>
                    <option value="Noto Kufi Arabic">Noto Kufi Arabic</option>
                  </select>
                </div>

                <div>
                  <Label className="mb-2 block">Font Size: {selectedItem.fontSize}px</Label>
                  <Slider 
                    value={[selectedItem.fontSize || 64]} 
                    min={12} max={200} step={2}
                    onValueChange={([val]) => updateItem(selectedItem.id, { fontSize: val })}
                  />
                </div>
              </>
            )}

            {/* DIMENSION CONTROLS */}
            {selectedItem.type !== 'text' && (
              <div>
                <Label className="mb-2 block">Width: {selectedItem.width}px</Label>
                <Slider 
                  value={[selectedItem.width || 300]} 
                  min={20} max={1080} step={10}
                  onValueChange={([val]) => updateItem(selectedItem.id, { width: val })}
                />
              </div>
            )}
            
            {['box', 'image', 'video'].includes(selectedItem.type) && (
              <>
                {selectedItem.type === 'box' && (
                  <div>
                    <Label className="mb-2 block">Height: {selectedItem.height}px</Label>
                    <Slider 
                      value={[selectedItem.height || 200]} 
                      min={20} max={1920} step={10}
                      onValueChange={([val]) => updateItem(selectedItem.id, { height: val })}
                    />
                  </div>
                )}
                <div>
                  <Label className="mb-2 block">Corner Radius: {selectedItem.borderRadius || 0}px</Label>
                  <Slider 
                    value={[selectedItem.borderRadius || 0]} 
                    min={0} max={500} step={4}
                    onValueChange={([val]) => updateItem(selectedItem.id, { borderRadius: val })}
                  />
                </div>
              </>
            )}
            
            {/* COLOR CONTROLS */}
            {(selectedItem.type === 'text' || selectedItem.type === 'star' || selectedItem.type === 'box') && (
              <div>
                <Label className="mb-2 block">Color Palette</Label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {BRAND_COLORS.map(c => (
                    <button 
                      key={c.hex} 
                      onClick={() => updateItem(selectedItem.id, { color: c.hex })}
                      className={`w-8 h-8 rounded-full border-2 ${selectedItem.color === c.hex ? 'border-blue-500' : 'border-gray-200'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
                <input 
                  type="color" 
                  value={selectedItem.color} 
                  onChange={(e) => updateItem(selectedItem.id, { color: e.target.value })}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
            )}

            {selectedItem.type === 'logo' && (
              <div>
                <Label className="mb-2 block">Logo Lockup Color</Label>
                <div className="flex gap-2">
                  <Button variant={selectedItem.color === '#000000' || !selectedItem.color ? 'default' : 'outline'} onClick={() => updateItem(selectedItem.id, { color: '#000000' })}>Black</Button>
                  <Button variant={selectedItem.color === '#ffffff' ? 'default' : 'outline'} onClick={() => updateItem(selectedItem.id, { color: '#ffffff' })}>White</Button>
                </div>
              </div>
            )}

            {/* SHARED CONTROLS */}
            <div className="pt-4 border-t space-y-4">
               <div>
                 <Label className="mb-2 block">Layer (Z-Index): {selectedItem.zIndex}</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => updateItem(selectedItem.id, { zIndex: selectedItem.zIndex - 1 })}>- Back</Button>
                    <Button variant="outline" size="sm" onClick={() => updateItem(selectedItem.id, { zIndex: selectedItem.zIndex + 1 })}>+ Forward</Button>
                  </div>
               </div>

              <Button onClick={() => deleteItem(selectedItem.id)} variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" /> Delete Element
              </Button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
