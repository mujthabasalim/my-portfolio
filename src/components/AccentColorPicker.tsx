import { useState, useEffect, useRef, useCallback } from "react";
import { Palette, X, GripHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const presetColors = [
  { name: "Teal", hex: "#0a9e8f" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Rose", hex: "#e11d6d" },
  { name: "Orange", hex: "#e8690a" },
  { name: "Green", hex: "#1a9e52" },
  { name: "Cyan", hex: "#0891b2" },
  { name: "Yellow", hex: "#ca8a04" },
];

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function applyAccent(hex: string) {
  const { h, s, l } = hexToHsl(hex);
  const lDark = Math.min(l + 15, 70);
  const root = document.documentElement;
  const isDark = root.classList.contains("dark");
  const usedL = isDark ? lDark : l;

  root.style.setProperty("--primary", `${h} ${s}% ${usedL}%`);
  root.style.setProperty("--ring", `${h} ${s}% ${usedL}%`);
  root.style.setProperty("--neon-glow", `${h} ${s}% ${usedL}%`);
  root.style.setProperty(
    "--sidebar-primary",
    `${h} ${s}% ${Math.min(usedL + 6, 100)}%`,
  );
  root.style.setProperty(
    "--sidebar-ring",
    `${h} ${s}% ${Math.min(usedL + 6, 100)}%`,
  );

  root.dataset.accentHex = hex;
  localStorage.setItem("accent-hex", hex);
}

function SLCanvas({
  hue,
  sat,
  light,
  onChange,
}: {
  hue: number;
  sat: number;
  light: number;
  onChange: (s: number, l: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const w = cv.width,
      h = cv.height;
    const gradH = ctx.createLinearGradient(0, 0, w, 0);
    gradH.addColorStop(0, "#fff");
    gradH.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, w, h);
    const gradV = ctx.createLinearGradient(0, 0, 0, h);
    gradV.addColorStop(0, "rgba(0,0,0,0)");
    gradV.addColorStop(1, "#000");
    ctx.fillStyle = gradV;
    ctx.fillRect(0, 0, w, h);
  }, [hue]);

  useEffect(() => {
    draw();
  }, [draw]);

  const pick = (e: React.MouseEvent | MouseEvent) => {
    const cv = canvasRef.current!;
    const rect = cv.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const newS = Math.round(x * 100);
    const newL = Math.round((1 - y) * (100 - newS / 2));
    onChange(newS, Math.max(0, Math.min(100, newL)));
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dragging.current) pick(e);
    };
    const up = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  const cx = sat;
  const cy = 100 - light / (1 - sat / 200);

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden cursor-crosshair">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="w-full h-full"
        onMouseDown={(e) => {
          dragging.current = true;
          pick(e);
        }}
      />
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-background shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${Math.max(0, Math.min(100, cx))}%`,
          top: `${Math.max(0, Math.min(100, cy))}%`,
          background: `hsl(${hue}, ${sat}%, ${light}%)`,
        }}
      />
    </div>
  );
}

function HueSlider({
  hue,
  onChange,
}: {
  hue: number;
  onChange: (h: number) => void;
}) {
  return (
    <div
      className="relative w-full h-4 rounded-full cursor-pointer"
      style={{
        background:
          "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
      }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onChange(Math.round(((e.clientX - rect.left) / rect.width) * 360));
      }}
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-background shadow-md pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          background: `hsl(${hue}, 100%, 50%)`,
        }}
      />
    </div>
  );
}

function useDraggable(initialPos: { x: number; y: number }) {
  const [pos, setPos] = useState(initialPos);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      setPos({
        x: Math.max(
          0,
          Math.min(window.innerWidth - 48, dragRef.current.origX + dx),
        ),
        y: Math.max(
          0,
          Math.min(window.innerHeight - 48, dragRef.current.origY + dy),
        ),
      });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return { pos, setPos, onDragStart };
}

const MAX_RECENT = 5;

function loadRecentColors(): string[] {
  try {
    const raw = localStorage.getItem("accent-recent");
    if (raw)
      return JSON.parse(raw)
        .filter((c: string) => /^#[0-9a-fA-F]{6}$/.test(c))
        .slice(0, MAX_RECENT);
  } catch (err) {
    console.log(err);
  }
  return [];
}

function saveRecentColor(hex: string, recent: string[]): string[] {
  const filtered = recent.filter((c) => c.toLowerCase() !== hex.toLowerCase());
  const updated = [hex, ...filtered].slice(0, MAX_RECENT);
  localStorage.setItem("accent-recent", JSON.stringify(updated));
  return updated;
}

const AccentColorPicker = () => {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState("#0a9e8f");
  const [hue, setHue] = useState(175);
  const [recentColors, setRecentColors] = useState<string[]>(loadRecentColors);
  const [sat, setSat] = useState(80);
  const [light, setLight] = useState(32);
  const panelRef = useRef<HTMLDivElement>(null);

  // Separate draggable positions for icon and panel
  const icon = useDraggable({
    x: typeof window !== "undefined" ? window.innerWidth - 64 : 0,
    y: typeof window !== "undefined" ? window.innerHeight - 64 : 0,
  });
  const panel = useDraggable({
    x: typeof window !== "undefined" ? window.innerWidth - 288 : 0,
    y: typeof window !== "undefined" ? window.innerHeight - 440 : 0,
  });

  // Track if dragged to distinguish click vs drag on icon
  const wasDragged = useRef(false);
  const iconDragStart = (e: React.MouseEvent) => {
    wasDragged.current = false;
    const startX = e.clientX,
      startY = e.clientY;
    e.preventDefault();
    const origPos = { ...icon.pos };
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) wasDragged.current = true;
      icon.setPos({
        x: Math.max(0, Math.min(window.innerWidth - 48, origPos.x + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 48, origPos.y + dy)),
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (!wasDragged.current) {
        // Position panel near icon
        panel.setPos({
          x: Math.max(0, Math.min(window.innerWidth - 272, icon.pos.x - 224)),
          y: Math.max(0, Math.min(window.innerHeight - 420, icon.pos.y - 420)),
        });
        setOpen(true);
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    const saved = localStorage.getItem("accent-hex");
    if (saved && /^#[0-9a-fA-F]{6}$/.test(saved)) {
      setHex(saved);
      const hsl = hexToHsl(saved);
      setHue(hsl.h);
      setSat(hsl.s);
      setLight(hsl.l);
      applyAccent(saved);
    }
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const saved = document.documentElement.dataset.accentHex;
      if (saved) applyAccent(saved);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const updateFromHSL = (h: number, s: number, l: number) => {
    setHue(h);
    setSat(s);
    setLight(l);
    const newHex = hslToHex(h, s, l);
    setHex(newHex);
    applyAccent(newHex);
    setRecentColors((prev) => saveRecentColor(newHex, prev));
  };

  const [hexInput, setHexInput] = useState(hex);

  // Keep input in sync when color changes from non-input sources
  useEffect(() => {
    setHexInput(hex);
  }, [hex]);

  const updateFromHex = (value: string) => {
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      setHex(value);
      const hsl = hexToHsl(value);
      setHue(hsl.h);
      setSat(hsl.s);
      setLight(hsl.l);
      applyAccent(value);
      setRecentColors((prev) => saveRecentColor(value, prev));
    }
  };

  const commitHexInput = () => {
    const v = hexInput.startsWith("#") ? hexInput : `#${hexInput}`;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      updateFromHex(v);
    } else {
      setHexInput(hex); // revert invalid input
    }
  };

  return (
    <>
      {/* Floating draggable icon — hidden when panel is open */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onMouseDown={iconDragStart}
            aria-label="Change accent color"
            className="fixed z-[100] w-12 h-12 rounded-full glass-card border border-glass-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors duration-300 cursor-grab active:cursor-grabbing shadow-lg"
            style={{ left: icon.pos.x, top: icon.pos.y }}
          >
            <Palette className="w-5 h-5" />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card"
              style={{ background: hex }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating draggable panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            style={{ position: "fixed", left: panel.pos.x, top: panel.pos.y }}
            className="z-[100] w-64 glass-card border border-glass-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div
              onMouseDown={panel.onDragStart}
              className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing border-b border-glass-border bg-muted/30"
            >
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <GripHorizontal className="w-3.5 h-3.5" />
                Accent Color
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 space-y-3">
              <SLCanvas
                hue={hue}
                sat={sat}
                light={light}
                onChange={(s, l) => updateFromHSL(hue, s, l)}
              />
              <HueSlider
                hue={hue}
                onChange={(h) => updateFromHSL(h, sat, light)}
              />
              <div className="flex items-center gap-2">
                <label className="relative w-8 h-8 rounded-lg border border-glass-border shrink-0 cursor-pointer overflow-hidden">
                  <div className="w-full h-full" style={{ background: hex }} />
                  <input
                    type="color"
                    value={hex}
                    onChange={(e) => updateFromHex(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => setHexInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitHexInput();
                  }}
                  onBlur={commitHexInput}
                  placeholder="#0a9e8f"
                  className="flex-1 h-8 px-2 text-xs font-mono rounded-lg border border-glass-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  maxLength={7}
                />
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Presets
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {presetColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => updateFromHex(c.hex)}
                      aria-label={c.name}
                      title={c.name}
                      className={`w-6 h-6 rounded-md transition-all duration-200 hover:scale-110 ${
                        hex.toLowerCase() === c.hex.toLowerCase()
                          ? "ring-2 ring-foreground/30 ring-offset-1 ring-offset-card scale-110"
                          : ""
                      }`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>
              {recentColors.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Recent
                  </p>
                  <div className="flex gap-1.5">
                    {recentColors.map((c, i) => (
                      <button
                        key={`${c}-${i}`}
                        onClick={() => updateFromHex(c)}
                        aria-label={`Recent color ${c}`}
                        title={c}
                        className={`w-6 h-6 rounded-md transition-all duration-200 hover:scale-110 ${
                          hex.toLowerCase() === c.toLowerCase()
                            ? "ring-2 ring-foreground/30 ring-offset-1 ring-offset-card scale-110"
                            : ""
                        }`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccentColorPicker;
