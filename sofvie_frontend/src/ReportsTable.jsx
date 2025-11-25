// src/ReportsTable.jsx
import React from "react";

export default function ReportsTable({reports, loading}) {
  return (
    <div style={{background:'#fff', padding:12, borderRadius:8}}>
      <h4>Recent Reports</h4>
      {loading ? <div>Loading...</div> : (
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{textAlign:'left', borderBottom:'1px solid #eee'}}>
                <th style={{padding:8}}>ID</th>
                <th>Timestamp</th>
                <th>Site</th>
                <th>Area</th>
                <th>Hazard</th>
                <th>Severity</th>
                <th>PPE</th>
                <th>Injury</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice(0,40).map(r => (
                <tr key={r.report_id} style={{borderBottom:'1px solid #f2f2f2'}}>
                  <td style={{padding:8}}>{r.report_id}</td>
                  <td>{r.timestamp?.slice(0,19)}</td>
                  <td>{r.site}</td>
                  <td>{r.area}</td>
                  <td>{r.hazard_type}</td>
                  <td>{r.severity}</td>
                  <td>{r.ppe_compliant ? "Yes" : "No"}</td>
                  <td>{r.injury ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
