export function generatePaperHTML(data: any) {
  return `
    <div style="font-family: 'Times New Roman', Times, serif; color: #000; line-height: 1.5; padding: 0; max-width: 100%; margin: 0 auto; background: white;">
      
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 26px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px;">${data.schoolName || 'SCHOOL NAME'}</div>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">${data.examinationName || 'ANNUAL EXAMINATION'}${data.academicSession ? ` ${data.academicSession}` : ''}</div>
        <div style="font-size: 16px; font-weight: bold; text-transform: uppercase;">QUESTION PAPER</div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-weight: normal; font-size: 15px;">
        <div style="text-align: left;">
          <div>Class : ${data.className || '____'}</div>
          <div style="margin-top: 5px;">Time : ${data.time || '____'}</div>
        </div>
        <div style="text-align: right;">
          <div>Subject : ${data.subject || '____'}</div>
          <div style="margin-top: 5px;">Maximum Marks : ${data.maximumMarks || '____'}</div>
        </div>
      </div>

      <hr style="border: none; border-top: 1px solid #000; margin-bottom: 20px;" />

      <div style="text-align: center; margin-bottom: 15px;">
        <div style="font-weight: bold; text-transform: uppercase; font-size: 16px;">GENERAL INSTRUCTIONS</div>
      </div>
      <div style="font-size: 14px; margin-bottom: 25px; padding-left: 20px;">
        <div style="margin-bottom: 6px;">1. All questions are compulsory.</div>
        <div style="margin-bottom: 6px;">2. Read all questions carefully.</div>
        <div style="margin-bottom: 6px;">3. Marks are indicated against each question.</div>
        <div style="margin-bottom: 6px;">4. Write neat and legible answers.</div>
        <div style="margin-bottom: 6px;">5. Follow the instructions given in each section.</div>
      </div>

      <hr style="border: none; border-top: 1px solid #000; margin-bottom: 30px;" />

      ${data.sections?.map((section: any) => `
        <div style="text-align: center; margin-bottom: 25px;">
          <div style="display: inline-block; border: 1px solid #000; padding: 6px 20px; font-weight: bold; text-transform: uppercase; font-size: 16px; margin-bottom: 10px;">
            ${section.title || 'SECTION'}
          </div>
          <div style="font-weight: bold; text-transform: uppercase; font-size: 14px;">
            ${section.description || ''}
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          ${section.questions?.map((q: any) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 15px; page-break-inside: avoid;">
              <div style="flex: 1; padding-right: 20px;">
                <span style="font-weight: bold;">Q${q.number}.</span> ${q.text.replace(/\n/g, '<br/>')}
                ${q.options && q.options.length > 0 ? `
                  <div style="margin-top: 12px; margin-left: 25px;">
                    ${q.options.map((opt: string) => `<div style="margin-bottom: 8px;">${opt}</div>`).join('')}
                  </div>
                ` : ''}
              </div>
              <div style="font-weight: bold; white-space: nowrap;">
                [${q.marks}]
              </div>
            </div>
          `).join('')}
        </div>
      `).join('') || ''}

      <hr style="border: none; border-top: 1px solid #000; margin-top: 50px; margin-bottom: 20px;" />
      
      <div style="text-align: center; font-weight: bold; text-transform: uppercase; font-size: 15px; margin-bottom: 20px;">
        END OF QUESTION PAPER
      </div>
    </div>
  `;
}
