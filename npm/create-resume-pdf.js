import { writeFileSync } from "node:fs"

const pageWidth = 612
const pageHeight = 792
const leftMargin = 48
const rightMargin = pageWidth - leftMargin
const pages = []
let commands
let cursorY

function safeText(value) {
    return value
        .replaceAll("–", "-")
        .replaceAll("—", "-")
        .replaceAll("’", "'")
        .replaceAll("“", '"')
        .replaceAll("”", '"')
        .replaceAll("•", "-")
        .replace(/[^\x20-\x7E]/g, "")
        .replaceAll("\\", "\\\\")
        .replaceAll("(", "\\(")
        .replaceAll(")", "\\)")
}

function drawText(text, x, y, size = 9, font = "F1", color = "0.16 0.19 0.18") {
    commands.push(`BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x} ${y} Tm (${safeText(text)}) Tj ET`)
}

function drawRule(y) {
    commands.push(`0.72 G 0.6 w ${leftMargin} ${y} m ${rightMargin} ${y} l S`)
}

function startPage(isContinuation = false) {
    commands = []
    pages.push(commands)
    if (!isContinuation) {
        drawText("M. SHEIK MOULANA", leftMargin, 748, 19, "F2", "0.11 0.16 0.15")
        drawText("SENIOR TOOL MAINTENANCE ENGINEER | PRESS TOOLS | DIE MAINTENANCE | TOOL ROOM", leftMargin, 730, 8.5, "F2")
        drawText("No. 5/15, Seasa Nagar, Poonamallee, Tamil Nadu - 600056", leftMargin, 712, 8.5)
        drawText("Phone: +91 70927 01422  |  Email: moulanadie2@gmail.com", leftMargin, 698, 8.5)
        drawRule(686)
        cursorY = 670
    } else {
        cursorY = 752
    }
}

function ensureSpace(height) {
    if (cursorY - height < 46) startPage(true)
}

function wrappedLines(text, maxCharacters = 104) {
    const words = text.split(/\s+/)
    const lines = []
    let line = ""

    for (const word of words) {
        const nextLine = line ? `${line} ${word}` : word
        if (nextLine.length > maxCharacters && line) {
            lines.push(line)
            line = word
        } else {
            line = nextLine
        }
    }
    if (line) lines.push(line)
    return lines
}

function paragraph(text, options = {}) {
    const { size = 8.5, font = "F1", leading = 11, indent = 0, maxCharacters = 104 } = options
    const lines = wrappedLines(text, maxCharacters)
    ensureSpace(lines.length * leading + 2)
    for (const line of lines) {
        drawText(line, leftMargin + indent, cursorY, size, font)
        cursorY -= leading
    }
    cursorY -= 2
}

function bullet(text) {
    const lines = wrappedLines(text, 100)
    ensureSpace(lines.length * 10 + 1)
    lines.forEach((line, index) => {
        drawText(index === 0 ? `- ${line}` : `  ${line}`, leftMargin + 8, cursorY, 8.3)
        cursorY -= 10
    })
    cursorY -= 1
}

function section(title) {
    ensureSpace(24)
    drawText(title.toUpperCase(), leftMargin, cursorY, 10, "F2", "0.12 0.39 0.30")
    cursorY -= 5
    drawRule(cursorY)
    cursorY -= 16
}

function job(company, title, dates, description, duties = []) {
    ensureSpace(38)
    drawText(company, leftMargin, cursorY, 9.2, "F2", "0.11 0.16 0.15")
    cursorY -= 12
    paragraph(`${title} | ${dates}`, {size: 8.5, font: "F3", leading: 10.5})
    if (description) paragraph(description)
    duties.forEach(bullet)
    cursorY -= 8
}

startPage()

section("Professional Summary")
paragraph("Results-driven Senior Tool Maintenance Engineer with over 14 years of experience in press tool making, die maintenance, and tool room operations for the automotive industry in India and Malaysia. Proven expertise in preventive and breakdown maintenance, die spotting and try-out, hemming correction, trim line and draw die welding, jig and fixture making, and precision machining. Strong knowledge of Body-in-White (BIW) press tools and GD&T, supporting OEM and Tier-1 customers including Hyundai, Mando, Tenneco, and Royal Enfield. Committed to quality, on-time delivery, and continuous improvement.")

section("Core Skills")
paragraph("Tooling: Press Tool Making, Press Tool Maintenance, Die Maintenance, Tool Room Operations, Tool & Mould Maintenance, Jig & Fixture Making, Draw Die, Trim Die, Cutting and Non-Cutting Operations, Sheet Metal Stamping, BIW Press Tools", {maxCharacters: 102})
paragraph("Maintenance: Preventive Maintenance, Breakdown Maintenance, Die Spotting, Tool Try-out, Tool Trials, Troubleshooting, Root Cause Analysis, Fitting & Assembly", {maxCharacters: 102})
paragraph("Repairs & Corrections: EOH Changes, Hemming Correction, Trim Line Welding, Draw Die Welding, Hardening, Gas Cutting", {maxCharacters: 102})
paragraph("Machines: Precision Punch Former, Turning, Milling, Grinding, Jig Boring, Shaping, Conventional Machining", {maxCharacters: 102})
paragraph("Quality & Process: Geometric Dimensioning & Tolerancing (GD&T), Quality Inspection, Manufacturing Process Management, Shift-wise Reporting, Documentation, 5S", {maxCharacters: 102})
paragraph("Soft Skills: Team Leadership, Teamwork, Problem Solving, Time Management")
paragraph("Software: MS Office (Word, Excel), Windows")

section("Work Experience")
job(
    "NASH INDUSTRIES PRIVATE LIMITED",
    "Senior Engineer | Tool Maintenance",
    "April 2019 - Present",
    "A leading manufacturer of press tools and a supplier to leading companies such as Hyundai, Die Miller, Mando, Tenneco, Royal Enfield, and others.",
    [
        "Make, repair, and maintain press tools, including cutting and non-cutting operations, welding, and matching.",
        "Perform preventive and breakdown maintenance, die spotting, and tool try-out to keep production running smoothly.",
        "Carry out EOH changes and hemming correction; perform trim line welding and draw die welding.",
        "Operate the precision punch former machine and manufacture jigs and fixtures.",
        "Independently manage the manufacturing process and maintain shift-wise reports and documentation.",
        "Apply GD&T and operate turning, milling, grinding, jig boring, and shaping machines to meet quality standards.",
        "Lead and coordinate team members to complete tool maintenance tasks on schedule."
    ]
)
job(
    "BL MOULDING SDN BHD, Malaysia",
    "Tooling Engineer | Tool Room",
    "March 2017 - March 2019",
    "Established in 1992; engaged in metal fabrication, metal stamping, and tool and die making. Provides custom-made tools and dies, metal stamping, assemblies, and taping for air-conditioning, heat-exchanger, refrigeration, and gondola shelving components, as well as home and electrical appliance products."
)
job(
    "CAPARO ENGINEERING INDIA LIMITED",
    "Junior Engineer | Fitting & Assembly",
    "May 2016 - March 2017",
    "A leading manufacturer of press tools and a supplier of automobile body parts to leading companies, including Ashok Leyland and Honda."
)
job(
    "JBM AUTO SYSTEM PRIVATE LIMITED",
    "Junior Engineer | Die Maintenance",
    "July 2014 - April 2016",
    "A leading manufacturer of automobile body parts and sub-parts in BIW (Body-in-White) condition and a supplier of auto parts to Nissan Motor India."
)
job(
    "MYOUNG SHIN INDIA AUTOMOTIVE PRIVATE LIMITED",
    "Diploma Trainee | Die Maintenance",
    "June 2012 - June 2014",
    "A leading manufacturer of automobile body parts in BIW condition, supplying door and floor parts to Hyundai Motor India for models including the Accent, Santro, i10, and i20."
)

section("Education")
paragraph("Bachelor of Science (B.Sc.) in Computer Science - Bharathidasan University", {font: "F2"})
paragraph("Diploma in Tool & Die Engineering (2009 - 2012) - SBM Polytechnic College, Dindigul - 80%", {font: "F2"})
paragraph("SSLC (2007) - Government Boys Higher Secondary School, Natham - 79%", {font: "F2"})

section("Areas of Interest")
paragraph("Design and Development | Tool Room | Tool and Mould Maintenance")

const objects = []
const pageObjectNumbers = pages.map((_, index) => 5 + index * 2)
const contentObjectNumbers = pages.map((_, index) => 6 + index * 2)

objects[1] = "<< /Type /Catalog /Pages 2 0 R >>"
objects[2] = `<< /Type /Pages /Kids [${pageObjectNumbers.map(number => `${number} 0 R`).join(" ")}] /Count ${pages.length} >>`
objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"

pages.forEach((pageCommands, index) => {
    const pageNumber = pageObjectNumbers[index]
    const contentNumber = contentObjectNumbers[index]
    const stream = `${pageCommands.join("\n")}\n`
    objects[pageNumber] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 9 0 R >> >> /Contents ${contentNumber} 0 R >>`
    objects[contentNumber] = `<< /Length ${Buffer.byteLength(stream, "ascii")} >>\nstream\n${stream}endstream`
})
objects[9] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>"

let pdf = "%PDF-1.4\n% ATS-friendly resume\n"
const offsets = [0]
for (let number = 1; number < objects.length; number += 1) {
    offsets[number] = Buffer.byteLength(pdf, "ascii")
    pdf += `${number} 0 obj\n${objects[number]}\nendobj\n`
}

const xrefOffset = Buffer.byteLength(pdf, "ascii")
pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`
for (let number = 1; number < objects.length; number += 1) {
    pdf += `${String(offsets[number]).padStart(10, "0")} 00000 n \n`
}
pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`

writeFileSync(new URL("../public/Sheik_Moulana_ToolMaker.pdf", import.meta.url), Buffer.from(pdf, "ascii"))
console.log(`Created public/Sheik_Moulana_ToolMaker.pdf (${pages.length} pages).`)