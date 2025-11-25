// src/ReportForm.jsx
import React, { useState } from "react";

export default function ReportForm({onClose, onSaved}) {
  const initial = {
    report_id: `RPT${Date.now()}`,
    timestamp: new Date().toISOString(),
    site: "",
    site_type: "",
    area: "",
    latitude: 0,
    longitude: 0,
    shift: "Day",
    worker_id: "",
    role: "Operator",
    hazard_type: "Other",
    severity: 2,
    ppe_compliant: true,
    near_miss: false,
    injury: false,
    resolved: false,
    time_to_close_hours: null,
    risk_score: 30,
    equipment_id: "",
    temperature_c: null,
    visibility_m: null
  };
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/reports", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });
      if(!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed");
      }
      onSaved && onSaved();
    } catch(err) {
      console.error(err);
      setError("Failed to submit report. See console.");
    } finally { setSaving(false); }
  };

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <form onSubmit={submit} style={{background:'#fff', padding:20, borderRadius:8, width:640, maxHeight:'90vh', overflow:'auto'}}>
        <h3>New Hazard Report</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
          <label>Site <input required value={form.site} onChange={e=>setForm({...form, site:e.target.value})} /></label>
          <label>Area <input value={form.area} onChange={e=>setForm({...form, area:e.target.value})} /></label>
          <label>Shift
            <select value={form.shift} onChange={e=>setForm({...form, shift:e.target.value})}>
              <option>Day</option><option>Evening</option><option>Night</option>
            </select>
          </label>
          <label>Role <input value={form.role} onChange={e=>setForm({...form, role:e.target.value})} /></label>

          <label>Hazard Type
            <select value={form.hazard_type} onChange={e=>setForm({...form, hazard_type:e.target.value})}>
              <option>Ground Instability</option><option>Equipment Interference</option>
              <option>Environmental</option><option>Electrical</option><option>Chemical</option>
              <option>Slip/Trip</option><option>Ergonomics</option><option>Visibility</option><option>Other</option>
            </select>
          </label>

          <label>Severity
            <input type="number" min="1" max="5" value={form.severity} onChange={e=>setForm({...form, severity: Number(e.target.value)})} />
          </label>

          <label>Worker ID <input value={form.worker_id} onChange={e=>setForm({...form, worker_id:e.target.value})} /></label>
          <label>PPE Compliant
            <select value={form.ppe_compliant} onChange={e=>setForm({...form, ppe_compliant: e.target.value === "true"})}>
              <option value="true">Yes</option><option value="false">No</option>
            </select>
          </label>

          <label>Risk score
            <input type="number" value={form.risk_score} onChange={e=>setForm({...form, risk_score: Number(e.target.value)})} />
          </label>

          <label>Latitude <input value={form.latitude} onChange={e=>setForm({...form, latitude: Number(e.target.value)})} /></label>
          <label>Longitude <input value={form.longitude} onChange={e=>setForm({...form, longitude: Number(e.target.value)})} /></label>
        </div>

        <div style={{marginTop:12, display:'flex', gap:8}}>
          <button type="submit" disabled={saving}>{saving? "Saving..." : "Submit Report"}</button>
          <button type="button" onClick={onClose}>Cancel</button>
          {error && <div style={{color:'red', marginLeft:12}}>{error}</div>}
        </div>
      </form>
    </div>
  );
}
