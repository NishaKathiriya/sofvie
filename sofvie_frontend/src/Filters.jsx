// src/Filters.jsx
import React, { useMemo, useState } from "react";

export default function Filters({filters, setFilters, allReports}) {
  // derive site list
  const sites = useMemo(()=> {
    const s = new Set();
    (allReports || []).forEach(r => r.site && s.add(r.site));
    return Array.from(s).slice(0,10);
  }, [allReports]);

  const [local, setLocal] = useState(filters);

  const apply = () => {
    setFilters({...local});
  };

  const reset = () => {
    setLocal({site:'', start:'', end:''});
    setFilters({site:'', start:'', end:''});
  };

  return (
    <div style={{display:'flex', gap:12, alignItems:'center'}}>
      <div>
        <label style={{fontSize:12}}>Site</label><br/>
        <select value={local.site} onChange={(e)=>setLocal({...local, site:e.target.value})}>
          <option value="">All sites</option>
          {sites.map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label style={{fontSize:12}}>Start date</label><br/>
        <input type="date" value={local.start} onChange={(e)=>setLocal({...local, start:e.target.value})} />
      </div>

      <div>
        <label style={{fontSize:12}}>End date</label><br/>
        <input type="date" value={local.end} onChange={(e)=>setLocal({...local, end:e.target.value})} />
      </div>

      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={apply}>Apply</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
