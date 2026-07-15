import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

/*
======================================================
EXPORT LAYOUT PREPARATION

Before html2canvas captures the DOM:
  1. Widen the calendar to 2 200 px (landscape).
  2. Remove overflow-hidden from the root card so
     expanded cells are not clipped.
  3. Switch the grid from fixed 220 px rows to auto
     rows so every cell can grow to fit all tasks.
  4. Remove max-height / overflow constraints from
     every .cell-tasks-container so all tasks are
     rendered — no scrollbars, no hidden content.

All changes are stored and reversed after capture.
======================================================
*/

function prepareExport(element) {

    /* ── 1. Root element ── */
    const prev = {
        width: element.style.width,
        minWidth: element.style.minWidth,
        maxWidth: element.style.maxWidth,
        overflow: element.style.overflow,
        padding: element.style.padding,
    };

    element.style.width = "2200px";
    element.style.minWidth = "2200px";
    element.style.maxWidth = "2200px";
    element.style.overflow = "visible";
    element.style.padding = "40px";

    /* ── 2. Grid rows → auto ── */
    const grids = element.querySelectorAll(
        ".grid.grid-cols-7"
    );

    const prevGridStyles = Array.from(grids).map((g) => ({
        gridAutoRows: g.style.gridAutoRows,
    }));

    grids.forEach((g) => {
        g.style.gridAutoRows = "auto";
    });

    /* ── 3. Cell overflow ── */
    /* Skip the multi-day overlay — it is an absolute
       sibling, not a day cell. */
    const cells = grids.length
        ? Array.from(grids[grids.length - 1].children).filter(
              (c) => !c.hasAttribute("data-span-overlay")
          )
        : [];

    const prevCellStyles = cells.map((c) => ({
        overflow: c.style.overflow,
        height: c.style.height,
        minHeight: c.style.minHeight,
    }));

    cells.forEach((c) => {
        c.style.overflow = "visible";
        c.style.height = "auto";
        c.style.minHeight = "220px";
    });

    /* ── 4. Task containers ── */
    const containers = element.querySelectorAll(
        ".cell-tasks-container"
    );

    const prevContainerStyles = Array.from(containers).map(
        (c) => ({
            maxHeight: c.style.maxHeight,
            overflow: c.style.overflow,
            minHeight: c.style.minHeight,
        })
    );

    containers.forEach((c) => {
        c.style.maxHeight = "none";
        c.style.overflow = "visible";
        c.style.minHeight = "unset";
    });

    /* ── 5. Multi-day span bars ──
       Live positions assume fixed 220px rows. With rows
       switched to auto (step 2) the rows grow, so re-anchor
       each bar to its row's actual offsetTop. */
    const bars = element.querySelectorAll("[data-span-bar]");

    const prevBarStyles = Array.from(bars).map((b) => ({
        top: b.style.top,
    }));

    bars.forEach((b) => {
        const rowIndex = parseInt(b.getAttribute("data-row-index"), 10);
        const offset = parseFloat(b.getAttribute("data-bar-offset")) || 0;
        const rowFirstCell = cells[rowIndex * 7];

        if (rowFirstCell) {
            b.style.top = `${rowFirstCell.offsetTop + offset}px`;
        }
    });

    return {
        prev,
        grids,
        prevGridStyles,
        cells,
        prevCellStyles,
        containers,
        prevContainerStyles,
        bars,
        prevBarStyles,
    };
}

/*
======================================================
RESTORE STYLES
======================================================
*/

function restoreExport(state) {
    const {
        prev,
        grids,
        prevGridStyles,
        cells,
        prevCellStyles,
        containers,
        prevContainerStyles,
        bars,
        prevBarStyles,
        element,
    } = state;

    element.style.width = prev.width;
    element.style.minWidth = prev.minWidth;
    element.style.maxWidth = prev.maxWidth;
    element.style.overflow = prev.overflow;
    element.style.padding = prev.padding;

    grids.forEach((g, i) => {
        g.style.gridAutoRows = prevGridStyles[i].gridAutoRows;
    });

    cells.forEach((c, i) => {
        c.style.overflow = prevCellStyles[i].overflow;
        c.style.height = prevCellStyles[i].height;
        c.style.minHeight = prevCellStyles[i].minHeight;
    });

    containers.forEach((c, i) => {
        c.style.maxHeight = prevContainerStyles[i].maxHeight;
        c.style.overflow = prevContainerStyles[i].overflow;
        c.style.minHeight = prevContainerStyles[i].minHeight;
    });

    bars.forEach((b, i) => {
        b.style.top = prevBarStyles[i].top;
    });
}

/*
======================================================
PNG EXPORT
======================================================
*/

export async function downloadCalendarAsPNG(
    elementId,
    filename = "calendar"
) {

    const element = document.getElementById(elementId);

    if (!element) {
        console.error("Export element not found:", elementId);
        return;
    }

    const state = {
        element,
        ...prepareExport(element),
    };

    try {

        await new Promise((resolve) => setTimeout(resolve, 150));

        const canvas = await html2canvas(element, {
            scale: 2.5,
            useCORS: true,
            backgroundColor: null,
            logging: false,
            windowWidth: 2400,
            windowHeight: 1600,
        });

        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

    } catch (error) {
        console.error("PNG export failed:", error);
    } finally {
        restoreExport(state);
    }
}

/*
======================================================
PDF EXPORT — SINGLE PAGE
======================================================
*/

export async function downloadCalendarAsPDF(
    elementId,
    filename = "calendar"
) {

    const element = document.getElementById(elementId);

    if (!element) {
        console.error("Export element not found:", elementId);
        return;
    }

    const state = {
        element,
        ...prepareExport(element),
    };

    try {

        await new Promise((resolve) => setTimeout(resolve, 150));

        const canvas = await html2canvas(element, {
            scale: 2.5,
            useCORS: true,
            backgroundColor: null,
            logging: false,
            windowWidth: 2560,
            windowHeight: 1600,
        });

        const imgData = canvas.toDataURL("image/png");

        /*
        Use standard A4 landscape (297 × 210 mm).
        PDF viewers universally handle this size correctly.

        Custom page sizes (derived from canvas pixel dimensions)
        produce non-standard PDFs that render incorrectly —
        stretched, blurry, or clipped — in different viewers.
        */
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
            compress: true,
        });

        const pageW = pdf.internal.pageSize.getWidth();   // 297 mm
        const pageH = pdf.internal.pageSize.getHeight();  // 210 mm

        const canvasAspect = canvas.width / canvas.height;
        const pageAspect = pageW / pageH;

        let imgW, imgH, x, y;

        if (canvasAspect > pageAspect) {
            /*
            Canvas is wider than A4 ratio — fit to page width.
            */
            imgW = pageW;
            imgH = pageW / canvasAspect;
            x = 0;
            y = (pageH - imgH) / 2;
        } else {
            /*
            Canvas is taller than A4 ratio — fit to page height.
            */
            imgH = pageH;
            imgW = pageH * canvasAspect;
            x = (pageW - imgW) / 2;
            y = 0;
        }

        pdf.addImage(imgData, "PNG", x, y, imgW, imgH, undefined, "MEDIUM");

        pdf.save(`${filename}.pdf`);

    } catch (error) {
        console.error("PDF export failed:", error);
    } finally {
        restoreExport(state);
    }
}
