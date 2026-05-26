/**
 * PDF Report Generation Service
 * Generates health reports as PDF files
 */

const PDFDocument = require('pdfkit');

class PdfService {
  generateHealthReport(reportData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          size: 'A4', 
          margin: 50,
          info: {
            Title: 'Sehat Saathi Health Report',
            Author: 'Sehat Saathi AI',
          }
        });

        const buffers = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // ─── HEADER ───
        doc.rect(0, 0, 612, 100).fill('#0d6b4a');
        doc.fontSize(28).fillColor('white').text('🌿 Sehat Saathi', 50, 30);
        doc.fontSize(12).fillColor('#b8e6d0').text('AI Health Report / صحت رپورٹ', 50, 65);
        doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString('en-PK')}`, 400, 65, { align: 'right' });

        doc.moveDown(3);
        doc.fillColor('#1a2e25');

        // ─── PATIENT INFO ───
        if (reportData.patientSummary) {
          doc.fontSize(16).fillColor('#0d6b4a').text('Patient Summary', 50, 120);
          doc.moveTo(50, 140).lineTo(550, 140).stroke('#d0ece2');
          doc.fontSize(11).fillColor('#1a2e25').text(reportData.patientSummary, 50, 150, { width: 500 });
          doc.moveDown();
        }

        // ─── RISK SCORE ───
        if (reportData.riskScore !== undefined) {
          const y = doc.y + 10;
          doc.fontSize(16).fillColor('#0d6b4a').text('Health Risk Score', 50, y);
          doc.fontSize(36).fillColor(
            reportData.riskScore < 30 ? '#1a9e6e' : 
            reportData.riskScore < 60 ? '#f0a500' : '#e84040'
          ).text(`${reportData.riskScore}/100`, 50, y + 25);
          doc.moveDown(2);
        }

        // ─── SYMPTOMS ───
        if (reportData.symptoms && reportData.symptoms.length > 0) {
          const y = doc.y;
          doc.fontSize(16).fillColor('#0d6b4a').text('Reported Symptoms', 50, y);
          doc.moveTo(50, y + 20).lineTo(550, y + 20).stroke('#d0ece2');
          reportData.symptoms.forEach((s, i) => {
            doc.fontSize(11).fillColor('#1a2e25').text(`• ${s}`, 60, doc.y + 5);
          });
          doc.moveDown();
        }

        // ─── POSSIBLE CONDITIONS ───
        if (reportData.possibleConditions && reportData.possibleConditions.length > 0) {
          const y = doc.y + 5;
          doc.fontSize(16).fillColor('#0d6b4a').text('Possible Conditions', 50, y);
          doc.moveTo(50, y + 20).lineTo(550, y + 20).stroke('#d0ece2');
          reportData.possibleConditions.forEach((c) => {
            doc.fontSize(11).fillColor('#1a2e25')
              .text(`• ${c.name} — ${c.probability}% likelihood`, 60, doc.y + 5);
          });
          doc.moveDown();
        }

        // ─── RECOMMENDATIONS ───
        if (reportData.recommendations && reportData.recommendations.length > 0) {
          const y = doc.y + 5;
          doc.fontSize(16).fillColor('#0d6b4a').text('Recommendations', 50, y);
          doc.moveTo(50, y + 20).lineTo(550, y + 20).stroke('#d0ece2');
          reportData.recommendations.forEach((r) => {
            doc.fontSize(11).fillColor('#1a2e25').text(`✓ ${r}`, 60, doc.y + 5);
          });
          doc.moveDown();
        }

        // ─── DIET ADVICE ───
        if (reportData.dietAdvice) {
          const y = doc.y + 5;
          doc.fontSize(16).fillColor('#0d6b4a').text('Diet Advice / غذائی مشورہ', 50, y);
          doc.moveTo(50, y + 20).lineTo(550, y + 20).stroke('#d0ece2');
          doc.fontSize(11).fillColor('#1a2e25').text(reportData.dietAdvice, 50, doc.y + 5, { width: 500 });
          doc.moveDown();
        }

        // ─── FOLLOW-UP ───
        if (reportData.followUp) {
          const y = doc.y + 5;
          doc.fontSize(16).fillColor('#0d6b4a').text('Follow-Up', 50, y);
          doc.moveTo(50, y + 20).lineTo(550, y + 20).stroke('#d0ece2');
          doc.fontSize(11).fillColor('#1a2e25').text(reportData.followUp, 50, doc.y + 5, { width: 500 });
          doc.moveDown();
        }

        // ─── DISCLAIMER ───
        const disclaimerY = Math.max(doc.y + 20, 700);
        doc.rect(40, disclaimerY, 530, 60).fill('#fff8e6').stroke('#f0c040');
        doc.fontSize(9).fillColor('#7a5000')
          .text('⚠️ This is an AI-generated report and is NOT a substitute for professional medical advice.', 50, disclaimerY + 10, { width: 510 })
          .text('یہ AI رپورٹ ہے — حتمی تشخیص کے لیے ڈاکٹر سے ضرور ملیں۔', 50, disclaimerY + 30, { width: 510 });

        // ─── FOOTER ───
        doc.fontSize(8).fillColor('#5a7a6a')
          .text('Sehat Saathi — AI Healthcare for Pakistan | Emergency: 1122', 50, 780, { align: 'center', width: 500 });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new PdfService();
