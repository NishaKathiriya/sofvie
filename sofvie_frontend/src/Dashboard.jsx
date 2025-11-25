// src/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Filters from "./Filters";
import ReportForm from "./ReportForm";
import ReportsTable from "./ReportsTable";

const KPI = ({label, value}) => (
  <div style={{flex:1, padding:12, borderRadius:8, background:'#fff', boxShadow:'0 1px 6px rgba(0,0,0,0.06)', marginRight:12}}>
    <div style={{fontSize:12, color:'#666'}}>{label}</div>
    <div style={{fontSize:20, fontWeight:700}}>{value}</div>
  </div>
);

export default function Dashboard(){
  const [kpis, setKpis] = useState({});
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({site: "", start: "", end: ""});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if(filters.site) q.set("site", filters.site);
      if(filters.start) q.set("start_date", filters.start);
      if(filters.end) q.set("end_date", filters.end);

      const kres = await fetch(`/metrics/kpis?${q.toString()}`);
      const k = await kres.json();
      setKpis(k);

      const rres = await fetch(`/reports?${q.toString()}`);
      const r = await rres.json();
      setReports(r || []);
    } catch(err){
      console.error("fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchData(); }, [filters]);

  // build small series for chart
  const timeSeries = reports.slice(0,40).map(r=>({
    name: r.timestamp?.slice(0,10),
    incidents: r.injury?1:0,
    near_miss: r.near_miss?1:0
  })).reverse();

  const hazardCounts = {};
  reports.forEach(r=>{ if(r.hazard_type) hazardCounts[r.hazard_type] = (hazardCounts[r.hazard_type]||0)+1; });
  const hazardData = Object.keys(hazardCounts).slice(0,8).map(k=>({name:k, value:hazardCounts[k]}));

  return (
    <div style={{padding:24, fontFamily:'Inter, system-ui, Arial', background:'#f5f5f5', minHeight:'100vh'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Sofvie — Safety & Performance Dashboard</h2>
        <div>
          <button onClick={()=>{ setShowForm(true); }} style={{marginRight:10, padding:'8px 12px'}}>+ New Hazard Report</button>
          <button onClick={fetchData} style={{padding:'8px 12px'}}>Refresh</button>
        </div>
      </div>

      <div style={{display:'flex', gap:12, marginTop:12}}>
        <KPI label="Total Reports" value={kpis.total_reports ?? '—'} />
        <KPI label="Incidents" value={kpis.incidents ?? '—'} />
        <KPI label="Near Misses" value={kpis.near_misses ?? '—'} />
        <KPI label="Avg Risk Score" value={Math.round(kpis.avg_risk ?? 0)} />
      </div>

      <div style={{marginTop:18}}>
        <Filters filters={filters} setFilters={setFilters} allReports={reports} />
      </div>

      <div style={{display:'flex', marginTop:20, gap:20}}>
        <div style={{flex:2, background:'#fff', padding:16, borderRadius:8}}>
          <h4>Recent Events</h4>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={timeSeries}>
              <Tooltip />
              <Line type="monotone" dataKey="incidents" stroke="#e76f51" dot={{r:3}} />
              <Line type="monotone" dataKey="near_miss" stroke="#2a9d8f" dot={{r:3}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{flex:1, background:'#fff', padding:16, borderRadius:8}}>
          <h4>Top Hazards</h4>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={hazardData} dataKey="value" nameKey="name" outerRadius={70}>
                {hazardData.map((entry, index) => <Cell key={index} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{marginTop:18}}>
        <ReportsTable reports={reports} loading={loading} />
      </div>

      {showForm && <ReportForm onClose={()=>{ setShowForm(false); }} onSaved={()=>{ setShowForm(false); fetchData(); }} />}
    </div>
  );
}
