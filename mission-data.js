window.ARES_DATA = {
  waypoints: [
    {
      id: "hab",
      n: "Hab Base",
      x: -0.75,
      z: 0.7,
      a: "#4b6a8a",
      b: "#18222f",
      g: "M4 18a8 8 0 0116 0zM12 6v4",
      d: "Pressurised habitat, airlock and charging pad on the crater floor (Aeolis Palus).",
      lm: "Dome airlock, solar array, rover pad"
    },
    {
      id: "box",
      n: "Boxwork Ridge",
      x: 0,
      z: 0.12,
      a: "#c9894f",
      b: "#4a2414",
      g: "M3 17l4-8 3 5 3-9 4 12",
      d: "Intersecting mineralised fracture ridges, 1–3 m tall, enclosing pale hollows on lower Mount Sharp.",
      lm: "Honeycomb ridge network, pale hollows, loose slabs"
    },
    {
      id: "sil",
      n: "Silica Outcrop",
      x: 0.5,
      z: -0.02,
      a: "#e8d9c4",
      b: "#6b5a4a",
      g: "M12 3l7 9-7 9-7-9z",
      d: "Bright, hydrated-silica bedrock on the Vera Rubin Ridge flank. Primary sampling target.",
      lm: "Light-toned bedrock, angular float rock"
    },
    {
      id: "tube",
      n: "Lava Tube Entry",
      x: -0.55,
      z: -0.45,
      a: "#2c3140",
      b: "#05070A",
      g: "M12 4a8 8 0 100 16 8 8 0 000-16zm0 5a3 3 0 100 6 3 3 0 000-6z",
      d: "Skylight opening to a roofed basaltic tube. Storm shelter with ~60% less cosmic ray dose.",
      lm: "Collapsed rim, shadowed opening, basalt blocks"
    },
    {
      id: "cache",
      n: "Sample Cache",
      x: 0.62,
      z: 0.55,
      a: "#e26d3d",
      b: "#5a2312",
      g: "M5 8h14v10H5zM9 8V5h6v3",
      d: "Depot on Gediz Vallis alluvial fan where sealed cores are left for rover pickup.",
      lm: "Marker mast, orange cache box, flat dust pan"
    }
  ],

  hazards: [
    { x: -0.3, z: 0.3, r: 0.17 },
    { x: 0.42, z: 0.2, r: 0.13 },
    { x: 0.12, z: -0.7, r: 0.14 }
  ],

  layers: [
    ["opt", "Optical", "HiRISE", "Visible texture and boulder hazard mapping (UA HiRISE / JPL Mars Trek)", "#E7EAEE"],
    ["topo", "Topographic", "MOLA · DEM", "Contours and slope heat map from real DEM: gold above 15°, red above 24°", "#E26D3D"],
    ["spec", "Spectral", "CRISM", "False colour: magenta phyllosilicates, cyan sulfates, amber hydrated silica", "#D946EF"],
    ["therm", "Thermal", "THEMIS", "Thermal inertia: blue loose dust traps, warm solid bedrock", "#F59E0B"],
    ["rad", "Radiation", "RAD · DONKI", "Dose map: cyan is shielded, red is exposed", "#EF4444"]
  ],

  // Real Mars time and Sun position at Gale (Allison & McEwen 2000 / Mars24 algorithm). Checked: sol 1000 = 2015-05-30, sol 2786 = 2020-06-07.
  marsClock(date=new Date(),lonE=137.4,lat=-4.6){
  const R=Math.PI/180,mod=(a,m)=>((a%m)+m)%m;
  const jdUT=date.getTime()/864e5+2440587.5,jdTT=jdUT+(37+32.184)/86400,dt=jdTT-2451545.0;
  const M=19.3871+0.52402073*dt,aFMS=270.3871+0.524038496*dt;
  const A=[.0071,.0057,.0039,.0037,.0021,.0020,.0018],T=[2.2353,2.7543,1.1177,15.7866,2.1354,2.4694,32.8493],P=[49.409,168.173,191.837,21.736,15.704,95.528,49.095];
  let pbs=0;for(let i=0;i<7;i++)pbs+=A[i]*Math.cos((0.985626*dt/T[i]+P[i])*R);
  const eoc=(10.691+3.0e-7*dt)*Math.sin(M*R)+.623*Math.sin(2*M*R)+.05*Math.sin(3*M*R)+.005*Math.sin(4*M*R)+.0005*Math.sin(5*M*R)+pbs;
  const Ls=mod(aFMS+eoc,360),eot=2.861*Math.sin(2*Ls*R)-.071*Math.sin(4*Ls*R)+.002*Math.sin(6*Ls*R)-eoc;
  const msd=(jdTT-2451549.5)/1.0274912517+44796.0-0.0009626;      // Mars Sol Date
  const lonW=360-lonE,lmsd=msd-lonW/360;                          // local (Gale) sol date
  const lmst=mod(lmsd,1)*24,ltst=mod(lmst+eot/15,24);
  const ld=new Date(Date.UTC(2012,7,6,5,17,57)),jdL=ld.getTime()/864e5+2440587.5+(37+32.184)/86400;
  const lmsdL=(jdL-2451549.5)/1.0274912517+44796.0-0.0009626-lonW/360;
  const sol=Math.floor(lmsd)-Math.floor(lmsdL);
  const dec=Math.asin(Math.sin(25.19*R)*Math.sin(Ls*R)),h=(ltst-12)*15*R,ph=lat*R;
  const sinE=Math.sin(dec)*Math.sin(ph)+Math.cos(dec)*Math.cos(ph)*Math.cos(h),el=Math.asin(sinE);
  let az=Math.atan2(-Math.cos(dec)*Math.sin(h),Math.sin(dec)*Math.cos(ph)-Math.cos(dec)*Math.sin(ph)*Math.cos(h));
  return{sol,lmst,ltst,Ls,elDeg:el/R,azDeg:mod(az/R,360),dayLength:88775.244};
},

  async syncLive(apiKey = "DEMO_KEY", onReady) {
    const base = "https://api.nasa.gov", day = 864e5;
    const iso = t => new Date(t).toISOString().slice(0, 10);
    const get = async u => { const r = await fetch(u); if (!r.ok) throw new Error(u.split("?")[0] + " " + r.status); return r.json(); };
    const now = Date.now();
    const jobs = [
      // mission status: latest sol that has data, so the UI can say how fresh the imagery is
      (async () => {
        const { photo_manifest: m } = await get(`${base}/mars-photos/api/v1/manifests/curiosity?api_key=${apiKey}`);
        this.manifest = { maxSol: m.max_sol, maxDate: m.max_date, status: m.status, total: m.total_photos };
      })(),
      // newest Curiosity images (not a fixed old sol); prefer Mastcam, spread across waypoints
      (async () => {
        const d = await get(`${base}/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${apiKey}`);
        const all = d.latest_photos || d.photos || [];
        const mast = all.filter(p => /^MAST/i.test(p.camera.name));
        const pool = mast.length >= 3 ? mast : all;
        if (!pool.length) return;
        this.waypoints.forEach((wp, i) => {
          const p = pool[Math.floor(i * pool.length / this.waypoints.length)];
          wp.img = p.img_src; wp.sol = p.sol; wp.cam = p.camera.full_name; wp.earthDate = p.earth_date;
        });
      })(),
      // NASA DONKI space weather (observed from Earth/L1 spacecraft, see note in the UI)
      (async () => {
        const f = await get(`${base}/DONKI/FLR?startDate=${iso(now - 7 * day)}&endDate=${iso(now)}&api_key=${apiKey}`);
        if (Array.isArray(f) && f.length) this.latestFlare = f[f.length - 1];
      })(),
      (async () => {
        const e = await get(`${base}/DONKI/SEP?startDate=${iso(now - 14 * day)}&endDate=${iso(now)}&api_key=${apiKey}`);
        if (Array.isArray(e) && e.length) this.latestSEP = e[e.length - 1];
      })()
    ];
    const res = await Promise.allSettled(jobs);
    res.filter(r => r.status === "rejected").forEach(r => console.warn("Live NASA data unavailable:", r.reason));
    this.liveOk = res.some(r => r.status === "fulfilled");
    if (typeof onReady === "function") onReady(this);
  }
};
