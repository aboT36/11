// جدول NRC (اختصرنا الصفوف لثلاثة أمثلة؛ أكمل باقي الجدول بنفس النمط)
const nrcTable = [
  {bw:50, adg:0.5, dmPct:3.5, dm:1.75, tdn:0.95, tdnPct:54, cp:0.30, cpPct:17.1},
  {bw:100, adg:1.0, dmPct:3.5, dm:3.50, tdn:2.00, tdnPct:57, cp:0.70, cpPct:20.0},
  {bw:700, adg:1.5, dmPct:2.4, dm:16.80, tdn:10.44, tdnPct:62, cp:4.30, cpPct:25.6}
];

function onMethodChange(){
  const m = document.getElementById('method').value;
  document.getElementById('tmrSection').classList.toggle('hidden', m!=='tmr');
  document.getElementById('milkOption').classList.toggle('hidden', m==='traditional');
  onGenderChange();
}
function onGenderChange(){
  const g = document.getElementById('gender').value;
  const m = document.getElementById('method').value;
  document.getElementById('milkOption').classList.toggle('hidden', g!=='female' || m!=='traditional');
}
function onFemaleTypeChange(){
  const t = document.getElementById('femaleType').value;
  document.getElementById('milkInput').classList.toggle('hidden', t!=='lactating');
}

function calculate(){
  const method = document.getElementById('method').value;
  const gender = document.getElementById('gender').value;
  const weight = parseFloat(document.getElementById('weight').value) || 0;

  let protein = 0;
  let energy = 0;

  if(method==='traditional'){
    const base = Math.pow(weight,0.75)*4;
    if(gender==='male'){
      protein = base + 200;
    } else {
      const type = document.getElementById('femaleType').value;
      if(type==='dry'){
        protein = base + 150;
      } else {
        const liters = parseFloat(document.getElementById('milkLiters').value) || 0;
        let bonus = 0;
        // حدد العامل بحسب الحيوان عبر مُدخل أو ثابت
        const species = prompt('أدخل نوع الحيوان: cow, sheep, goat');
        const rate = species==='cow' ? 34
                   : species==='sheep' ? 55
                   : 48;
        bonus = rate * liters * 3.5;
        protein = base + 200 + bonus;
      }
    }
  }
  else if(method==='tmr'){
    // هنا نحسب علف جاف كنسبة 4.5%
    protein = weight * 0.045;
  }
  else if(method==='nrc'){
    // اختيار أقرب وزن من الجدول
    const row = nrcTable.reduce((prev,curr)=>
      Math.abs(curr.bw-weight) < Math.abs(prev.bw-weight) ? curr : prev
    );
    protein = row.cp;
    energy = row.tdn;
  }

  // عرض النتائج
  let output = `البروتين المطلوب: ${protein.toFixed(2)} جرام\n`;
  if(energy) {
    output += `الطاقة المطلوبة (TDN): ${energy.toFixed(2)} كجم\n`;
  }
  document.getElementById('output').textContent = output;
  document.getElementById('result').classList.remove('hidden');
}

// ربط الأحداث
document.addEventListener('DOMContentLoaded', ()=> {
  document.getElementById('method').addEventListener('change', onMethodChange);
  document.getElementById('gender').addEventListener('change', onGenderChange);
  document.getElementById('femaleType').addEventListener('change', onFemaleTypeChange);
});
