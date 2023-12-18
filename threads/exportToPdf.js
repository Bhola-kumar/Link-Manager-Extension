function centerAlignText(pdf, text, fontSize, y) {
    const textWidth = pdf.getTextWidth(text);
    const pageWidth = pdf.internal.pageSize.width;
    const x = (pageWidth - textWidth) / 2;
    pdf.text(x, y, text);
}


function exportListToPDF() {
    if (confirm(`Export the data into a PDF file?`)) {
        window.jsPDF = window.jspdf.jsPDF;
        chrome.storage.sync.get(null, function (dict) {
            const pdf = new jsPDF();
            // Print current date and time
            const currentDate = new Date();
            const dateString = ` ${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
            pdf.setFontSize(8);
            centerAlignText(pdf, dateString, 30, 12);
            // Header
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(18);
            centerAlignText(pdf, "Link Manager Extension", 20, 20);

            pdf.setFontSize(12);
            centerAlignText(pdf, "Your saved data", 30, 28);
            let y = 38;

            for (let key in dict) {
                if (typeof dict[key] !== "string") {
                    const folderName = key;
                    const folderList = dict[key];

                    pdf.setFont("helvetica", "bold");
                    pdf.setFontSize(14);
                    y = addWrappedText(pdf, `Folder: ${folderName}`, 20, y, 180, 8);

                    for (let folderKey in folderList) {
                        pdf.setFont("helvetica", "normal");
                        pdf.setFontSize(12);
                        y = addWrappedText(pdf, `Title: ${folderKey}`, 28, y, 160, 5);
                        pdf.setFont("helvetica", "normal");
                        pdf.setTextColor(0, 0, 255);
                        y = addWrappedTextWithLink(pdf, folderList[folderKey], 28, y, 160, 8, { url: folderList[folderKey] });
                        pdf.setTextColor(0, 0, 0);

                        // Check if content exceeds the page height, then add a new page
                        if (y > pdf.internal.pageSize.height - 10) {
                            pdf.addPage();
                            y = 10; // Reset y-coordinate for the new page
                        }
                    }
                }
            }
            pdf.save('list.pdf');
        });
    }
}

function addWrappedText(pdf, text, x, y, maxWidth, lineHeight) {
    const words = pdf.splitTextToSize(text, maxWidth);
    for (let i = 0; i < words.length; i++) {
        pdf.text(x, y + i * lineHeight, words[i]);
    }
    return y + words.length * lineHeight;
}

function addWrappedTextWithLink(pdf, text, x, y, maxWidth, lineHeight, link) {
    const words = pdf.splitTextToSize(text, maxWidth);
    let concatenatedText = '';

    for (let i = 0; i < words.length; i++) {
        const lineX = x;
        const lineY = y + i * lineHeight;
        const lineWidth = pdf.getTextWidth(words[i]);
        
        pdf.text(lineX, lineY, words[i]);

        concatenatedText += words[i];
        if (i < words.length - 1) {
            concatenatedText += ' ';
        }

        if (i === words.length - 1) {
            const linkX = x;
            const linkY = y + i * lineHeight;
            const linkWidth = pdf.getTextWidth(concatenatedText);
            pdf.link(linkX, linkY, linkWidth, lineHeight, link);
        }
    }
    return y + words.length * lineHeight;
}



export { exportListToPDF };
