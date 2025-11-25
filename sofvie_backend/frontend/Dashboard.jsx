import React, { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const KPI = ({label, value}) => (
  <div style={{flex:1, padding:12, borderRadius:8, background:'#fff', boxShadow:'0 1px 6px rgba(0,0,0,0.08)', marginRight:12}}>
    <div style={{fontSize:12, color:'#666'}}>{label}</div>
    <div style={{fontSize:20, fontWeight:700}}>{value}</div>
  </div>
);

export default function Dashboard(){ 
  const [kpis, setKpis] = useState({});
  const [reports, setReports] = useState([]);

  useEffect(()=>{
    fetch("/metrics/kpis").then(r=>r.json()).then(setKpis).catch(()=>{});
    fetch("/reports").then(r=>r.json()).then(setReports).catch(()=>{});
  },[]);

  const timeSeries = reports.slice(0,20).map((r,i)=>({name:r.timestamp, incidents: r.injury?1:0, near_miss: r.near_miss?1:0})).reverse();
  const hazardCounts = {};
  reports.forEach(r=>{ hazardCounts[r.hazard_type] = (hazardCounts[r.hazard_type]||0)+1; });
  const hazardData = Object.keys(hazardCounts).slice(0,8).map(k=>({name:k, value:hazardCounts[k]}));

  return (
    <div style={{padding:24, fontFamily:'Inter, system-ui, Arial'}}>
      <h2>Sofvie — Operational Safety & Performance Insights</h2>
      <div style={{display:'flex', marginTop:12}}>
        <KPI label="Total Reports" value={kpis.total_reports ?? '—'} />
        <KPI label="Incidents" value={kpis.incidents ?? '—'} />
        <KPI label="Near Misses" value={kpis.near_misses ?? '—'} />
        <KPI label="Avg Risk Score" value={Math.round(kpis.avg_risk) ?? '—'} />
      </div>

      <div style={{display:'flex', marginTop:20, gap:20}}>
        <div style={{flex:2, background:'#fff', padding:16, borderRadius:8}}>
          <h4>Recent events (time series)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timeSeries}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="incidents" stroke="#8884d8" />
              <Line type="monotone" dataKey="near_miss" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{flex:1, background:'#fff', padding:16, borderRadius:8}}>
          <h4>Top hazards</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={hazardData} dataKey="value" nameKey="name" outerRadius={60} fill="#8884d8">
                {hazardData.map((entry, index) => <Cell key={`cell-${index}`} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}