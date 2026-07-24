import { useEffect, useRef } from "react";

export function SaeedSignature() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGSAPAndInit = () => {
      if (!(window as any).gsap) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
        script.async = true;
        script.onload = setupObserver;
        document.body.appendChild(script);
      } else {
        setupObserver();
      }
    };

    const setupObserver = () => {
      if (!containerRef.current) return;
      
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          buildSaeedSignature();
          observer.disconnect();
        }
      }, { threshold: 0.5 });

      observer.observe(containerRef.current);

      return () => observer.disconnect();
    };

    function buildSaeedSignature() {
      const gsap = (window as any).gsap;
      if (!gsap) return;

      const F: Record<string, string[]> = {
        S: ["01111","10000","10000","01110","00001","00001","11110"],
        A: ["01110","10001","10001","11111","10001","10001","10001"],
        E: ["11111","10000","10000","11110","10000","10000","11111"],
        D: ["11110","10001","10001","10001","10001","10001","11110"]
      };
      
      const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const bn = containerRef.current;
      if (!bn) return;

      // Clean up just in case
      bn.innerHTML = '';
      
      const S = 20, D = 7, y0 = 16;
      const face: Record<string, string[]> = {
        s: ['#F6EFE3','#FFFDF6','#D8CFBE'],
        k: ['#0B7A75','#17A099','#07514D'],
        o: ['#FF6B35','#FF8B5E','#D14E1F']
      };

      function brick(x: number, y: number, w: number, fc: string[]) {
        let studs = '';
        for(let i=0; i<w; i++){
          let cx = i*S + S/2 + D/2;
          studs += '<ellipse cx="'+cx+'" cy="'+(-D/2)+'" rx="5" ry="2.8" fill="'+fc[1]+'"/>'
                 + '<ellipse cx="'+(cx-1.8)+'" cy="'+(-D/2-.8)+'" rx="1.6" ry=".9" fill="#fff" opacity=".7" stroke="none"/>';
        }
        let W1 = w*S;
        return '<g class="vox" data-x="'+x+'" data-cy="'+y+'" stroke="#131110" stroke-width="1.4" stroke-linejoin="round">'
             + '<polygon points="0,0 '+D+',-'+D+' '+(W1+D)+',-'+D+' '+W1+',0" fill="'+fc[1]+'"/>'
             + '<polygon points="'+W1+',0 '+(W1+D)+',-'+D+' '+(W1+D)+','+(S-D)+' '+W1+','+S+'" fill="'+fc[2]+'"/>'
             + '<rect width="'+W1+'" height="'+S+'" fill="'+fc[0]+'"/>'
             + studs + '</g>';
      }

      let offsetX = Math.floor((36-29)/2);
      let all: any[] = [];
      const word = "SAEED";

      for(let r=0; r<7; r++){
        for(let li=0; li<5; li++){
          let row = F[word[li]][r];
          let ci = 0;
          while(ci < 5){
            if(row[ci] !== '1'){ ci++; continue; }
            let run = 0;
            while(ci+run < 5 && row[ci+run] === '1') run++;
            let w = Math.min(run, 1 + ((Math.random()*3)|0));
            let cl = li === 4 ? 'o' : li === 1 ? 'k' : 's';
            let gx = offsetX + li*6 + ci, gy = r;
            all.push({tx: gx*S+2, ty: y0+gy*S, gx: gx, gy: gy, w: w, cl: cl});
            ci += w;
          }
        }
      }

      all.sort(function(a,b){ return (b.gy-a.gy) || (a.gx-b.gx); });
      let W = 36*S + D + 6, H = y0 + 8*S + D + 4;
      
      // We limit max-width so it's not too big and doesn't take too much height
      bn.innerHTML = '<svg width="100%" viewBox="0 0 '+W+' '+H+'" style="overflow:visible;max-width:180px;margin:auto;" aria-hidden="true">'
                   + all.map(function(b){ return brick(b.tx, b.ty, b.w, face[b.cl]); }).join('') 
                   + '</svg>';
                   
      let blocks = [].slice.call(bn.querySelectorAll('.vox')) as HTMLElement[];
      
      function done(){
        if(bn) bn.style.transform = "translateY(0)"; // subtle settle state if needed
      }
      
      if(RM){ setTimeout(done, 100); return; }
      
      gsap.set(blocks, {
        opacity: 0, 
        x: function(i: number, b: HTMLElement){ return parseFloat(b.dataset.x!); }, 
        y: function(i: number, b: HTMLElement){ return -(160 + Math.random()*100); }, 
        transformOrigin: '50% 100%'
      });
      
      let tl = gsap.timeline({onComplete: done});
      blocks.forEach(function(b, i){
        tl.to(b, {
          y: parseFloat(b.dataset.cy!), 
          opacity: 1, 
          duration: 0.5, 
          ease: 'bounce.out'
        }, i * 0.012 + Math.random() * 0.01);
      });
    }

    loadGSAPAndInit();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <span className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em] text-[#5d4037] mb-1">
        Built By
      </span>
      <div 
        id="brick-name" 
        ref={containerRef} 
        aria-hidden="true" 
        className="w-full flex justify-center"
      />
    </div>
  );
}
