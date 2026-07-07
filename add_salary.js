const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'jobs-db.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (data && data.length > 0) {
  data[0].salary_calculator = {
    enabled: true,
    base_pay: 56100, // Level 10 basic pay for IAS/IPS starting
    pay_level: "Level 10 (7th CPC)",
    da_percent: 50,
    hra_tier1_percent: 27,
    hra_tier2_percent: 18,
    hra_tier3_percent: 9,
    ta_tier1_amount: 3600,
    ta_tier2_amount: 1800,
    custom_allowances: [
      { name: "Special Duty Allowance", amount: 2500 }
    ]
  };
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  console.log("Updated jobs-db.json with ADVANCED salary calculator data for the first job.");
} else {
  console.log("No jobs found in jobs-db.json");
}
