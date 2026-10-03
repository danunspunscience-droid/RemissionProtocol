import React from 'react';

export const SettingsTab: React.FC = () => {
return (
<div className="space-y-6">
  <h3 className="text-xl font-semibold text-slate-100">Site System Settings</h3>
  <p className="text-sm text-slate-400">System configuration, API key status, and Cloudflare D1/R2 binding diagnostic indicators.</p>
</div>
);
};
