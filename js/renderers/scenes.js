const palette = ["#79baff", "#b8a0ff", "#55d6b1", "#ffc77a", "#fa8c9a"];
export function drawScene(canvas, s, w, h, motion = {}) {
  const progress = motion.progress ?? 1,
    old = motion.previous;
  const tween = (value, key) =>
    old && typeof old[key] === "number"
      ? old[key] + (value - old[key]) * (1 - (1 - progress) ** 3)
      : value;
  const c = canvas.getContext("2d");
  c.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  c.clearRect(0, 0, w, h);
  const text = (t, x, y, color = "#e6edf7", size = 14, align = "center") => {
    c.font = `500 ${size}px system-ui`;
    c.fillStyle = color;
    c.textAlign = align;
    c.fillText(String(t), x, y);
  };
  const dot = (x, y, r, color) => {
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fillStyle = color;
    c.fill();
  };
  const line = (x, y, u, v, color = "#455774", width = 1.5) => {
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(u, v);
    c.strokeStyle = color;
    c.lineWidth = width;
    c.stroke();
  };
  const bar = (label, value, max, y, color = palette[0], detail) => {
    text(label, 20, y - 10, "#b6c5dc", 14, "left");
    c.fillStyle = "#1a263b";
    c.fillRect(20, y, w - 40, 12);
    c.fillStyle = color;
    c.fillRect(
      20,
      y,
      (w - 40) *
        Math.max(
          0,
          Math.min(
            1,
            tween(
              value,
              {
                "Available work units": "budget",
                "Task demand": "demand",
                Completed: "completed",
                "Correct jobs completed": "completed",
                "Work attempts": "attempts",
                "Duplicated work": "duplicates",
              }[label],
            ) / max,
          ),
        ),
      12,
    );
    text(detail ?? value, w - 20, y - 10, "#e6edf7", 14, "right");
  };
  function graph(nodes, edges, removed, offset = 0, areaH = h) {
    const map = new Map(nodes.map((n) => [n.id, n]));
    const pos = (n) => [28 + n.x * (w - 56), offset + 30 + n.y * (areaH - 60)];
    for (const [a, b] of edges) {
      const u = map.get(a),
        v = map.get(b);
      if (!u || !v) continue;
      const dead = a === removed || b === removed;
      c.setLineDash(dead ? [4, 5] : []);
      line(...pos(u), ...pos(v), dead ? "#334057" : "#60789d", dead ? 1 : 1.6);
    }
    c.setLineDash([]);
    for (const n of nodes) {
      const [x, y] = pos(n);
      const color =
        n.color ??
        (n.role === "bridge"
          ? palette[1]
          : n.role === "unique skill"
            ? palette[3]
            : palette[0]);
      dot(x, y, n.role ? 12 : 9, n.id === removed ? "#283244" : color);
      if (n.id === removed) {
        line(x - 7, y - 7, x + 7, y + 7, "#fa8c9a", 2);
        line(x + 7, y - 7, x - 7, y + 7, "#fa8c9a", 2);
      } else if (n.carrier) {
        c.strokeStyle = palette[3];
        c.lineWidth = 3;
        c.beginPath();
        c.arc(x, y, 14, 0, Math.PI * 2);
        c.stroke();
      }
      if (nodes.length <= 16) {
        text(n.id, x, y + 5, "#08121f", 12);
        if (n.label) text(n.label, x, y + 30, "#e6edf7", 14);
      }
    }
  }
  if (s.type === "graph") {
    graph(s.nodes, s.edges, s.removed);
    return;
  }
  if (s.type === "arrows") {
    text("Task target →", w / 2, 28, palette[3]);
    s.angles.forEach((angle, i) => {
      const prior = old?.angles?.[i] ?? angle;
      const a =
        prior +
        Math.atan2(Math.sin(angle - prior), Math.cos(angle - prior)) *
          (1 - (1 - progress) ** 3);
      const col = i % 6,
        row = Math.floor(i / 6),
        x = 30 + (col * (w - 60)) / 5,
        y = 70 + (row * (h - 115)) / 3;
      const u = x + Math.cos(a) * 16,
        v = y + Math.sin(a) * 16;
      dot(x, y, 3, palette[1]);
      line(x, y, u, v, palette[0], 2);
      line(
        u,
        v,
        u - 7 * Math.cos(a - 0.5),
        v - 7 * Math.sin(a - 0.5),
        palette[0],
        2,
      );
      line(
        u,
        v,
        u - 7 * Math.cos(a + 0.5),
        v - 7 * Math.sin(a + 0.5),
        palette[0],
        2,
      );
    });
    return;
  }
  if (s.type === "bits") {
    if (!s.run) {
      text("Send a message. Then Step or Run.", w / 2, h / 2);
      text("Each square is one bit.", w / 2, h / 2 + 27, "#b6c5dc");
      return;
    }
    const r = s.run;
    const rows = [
      ["Original", r.bits],
      ...r.copies.map((bits, i) => [`Copy ${i + 1}`, bits]),
      ...(r.decoded ? [["Decoded", r.decoded]] : []),
    ];
    const step = Math.min(24, (w - 42) / 12),
      left = (w - step * 12) / 2,
      dy = Math.min(42, (h - 20) / rows.length);
    rows.forEach(([label, bits], j) => {
      const y = 20 + j * dy;
      text(label, left, y, "#b6c5dc", 12, "left");
      bits.forEach((b, i) => {
        c.fillStyle =
          j && b !== r.bits[i] ? "#fa8c9a" : b ? "#79baff" : "#243753";
        c.fillRect(left + i * step, y + 5, step - 3, Math.min(21, dy - 17));
        text(
          b,
          left + i * step + (step - 3) / 2,
          y + 20,
          b ? "#08121f" : "#e6edf7",
          12,
        );
      });
    });
    return;
  }
  if (s.type === "capacity") {
    bar("Available work units", s.budget, 24, 65);
    bar("Task demand", s.demand, 24, 140, palette[1]);
    bar("Completed", s.completed, 24, 215, palette[2]);
    bar("Deferred", s.demand - s.completed, 24, 290, palette[3]);
    return;
  }
  if (s.type === "person") {
    const x = w / 2,
      y = h * 0.43;
    if (!s.simple) {
      dot(x, y - 54, 24, palette[0]);
      line(x, y - 29, x, y + 45, palette[0], 14);
      line(x, y - 12, x - 49, y + 23, palette[0], 10);
      line(x, y - 12, x + 49, y + 23, palette[0], 10);
      line(x, y + 43, x - 35, y + 105, palette[0], 10);
      line(x, y + 43, x + 35, y + 105, palette[0], 10);
    } else {
      dot(x, y, 35, palette[0]);
      text("person", x, y + 5, "#08121f");
    }
    text(s.lens, w / 2, h - 48, palette[3]);
    text(
      s.simple
        ? "Selected variables remain"
        : "More than this picture can represent",
      w / 2,
      h - 22,
      "#b6c5dc",
      13,
    );
    return;
  }
  if (s.type === "roles") {
    const labels = ["Observe", "Design", "Build", "Verify"];
    const points = labels.map((label, i) => ({
      id: i,
      label,
      x: 0.22 + (i % 2) * 0.56,
      y: 0.22 + Math.floor(i / 2) * 0.56,
      color: s.connected ? palette[2] : palette[0],
    }));
    graph(
      points,
      s.connected
        ? [
            [0, 1],
            [1, 2],
            [2, 3],
          ]
        : [],
      s.missing ? 3 : null,
    );
    return;
  }
  if (s.type === "jobs") {
    bar("Correct jobs completed", s.completed, s.total, 65, palette[2]);
    bar(
      "Work attempts",
      s.attempts,
      Math.max(s.total, s.attempts),
      145,
      palette[0],
    );
    bar(
      "Duplicated work",
      s.duplicates,
      Math.max(s.total, s.attempts),
      225,
      palette[3],
    );
    text(
      `${s.workers} workers · ${s.serial ? "serial task" : s.organized ? "shared assignment" : "independent assignment"}`,
      w / 2,
      h - 30,
      "#b6c5dc",
      14,
    );
    return;
  }
  if (s.type === "chain") {
    const labels = ["World", "Source", "Channel", "Receiver", "Repeated"];
    s.values.forEach((v, i) => {
      const x = w / 2,
        y = 35 + (i * (h - 70)) / 4;
      if (i) line(x, y - (h - 70) / 4 + 16, x, y - 16);
      dot(x, y, 16, v === s.truth ? palette[2] : palette[3]);
      text(v, x, y + 5, "#08121f");
      text(labels[i], x - 30, y + 5, "#b6c5dc", 14, "right");
    });
    return;
  }
  if (s.type === "opinions") {
    text("Opinion distribution", w / 2, 28);
    const bins = Array(10).fill(0);
    s.opinions.forEach((x) => bins[Math.min(9, Math.floor((x + 1) * 5))]++);
    const bw = (w - 50) / 10;
    const peak = Math.max(20, ...bins);
    bins.forEach((n, i) => {
      c.fillStyle = palette[i < 4 ? 0 : i > 5 ? 1 : 2];
      c.fillRect(
        25 + i * bw,
        h - 50 - (n * (h - 100)) / peak,
        bw - 4,
        (n * (h - 100)) / peak,
      );
    });
    text("−1", 25, h - 22, "#b6c5dc");
    text("+1", w - 25, h - 22, "#b6c5dc");
    text("0", w / 2, h - 22, "#b6c5dc");
    return;
  }
  if (s.type === "estimate") {
    const left = 30,
      right = w - 30,
      map = (x) => left + (x / 100) * (right - left);
    line(left, h * 0.6, right, h * 0.6);
    for (const [i, x] of s.observations.entries())
      dot(map(x), h * 0.6 - 25 - (i % 5) * 13, 4, palette[0]);
    line(map(s.truth), 50, map(s.truth), h - 50, palette[3], 2);
    text("Target", map(s.truth), 35, palette[3]);
    if (s.observations.length) dot(map(s.mean), h * 0.6, 11, palette[2]);
    text("0", left, h - 25);
    text("100", right, h - 25);
    return;
  }
  if (s.type === "storage") {
    const labels = ["Person", "Record A", "Record B"];
    s.copies.forEach((copy, i) => {
      const x = 25 + (i * (w - 50)) / 3,
        y = h * 0.45;
      c.strokeStyle = "#61799d";
      c.lineWidth = 2;
      c.strokeRect(x, y, Math.max(35, (w - 75) / 3), 70);
      text(
        copy === null ? "×" : copy === 0 ? "Original" : "Altered",
        x + (w - 75) / 6,
        y + 42,
        copy === 0 ? palette[2] : palette[3],
        13,
      );
      text(labels[i], x + (w - 75) / 6, y - 18, "#b6c5dc", 12);
    });
    text(
      s.accessible ? "Records readable" : "Record access lost",
      w / 2,
      h - 35,
      s.accessible ? palette[0] : palette[3],
    );
    return;
  }
  if (s.type === "twins") {
    const narrow = w < 540;
    const panelW = narrow ? w : w / 2,
      panelH = narrow ? h / 2 : h;
    for (let j = 0; j < 2; j++) {
      const ox = narrow ? 0 : j * panelW,
        oy = narrow ? j * panelH : 0,
        vals = j ? s.b : s.a;
      text(j ? "Perturbed" : "Reference", ox + panelW / 2, oy + 20, "#b6c5dc");
      vals.forEach((v, i) => {
        const angle = (i / vals.length) * Math.PI * 2,
          x =
            ox +
            panelW / 2 +
            Math.cos(angle) * Math.min(panelW * 0.31, panelH * 0.31),
          y = oy + panelH * 0.55 + Math.sin(angle) * panelH * 0.31;
        dot(x, y, 5, `hsl(${210 - v * 150} 75% 65%)`);
      });
    }
    return;
  }
  if (s.type === "traces") {
    bar(s.labels[0], s.traces[0], 2, 90, palette[0], s.traces[0].toFixed(2));
    bar(s.labels[1], s.traces[1], 2, 190, palette[1], s.traces[1].toFixed(2));
    text("Reinforcement and decay", w / 2, h - 45, "#b6c5dc");
    return;
  }
  if (s.type === "tradeoff") {
    const x = (v) => 42 + ((v - 12) / 8) * (w - 70),
      y = (v) => h - 45 - v * (h - 85);
    line(42, 40, 42, h - 45);
    line(42, h - 45, w - 20, h - 45);
    for (const v of [0, 0.5, 1]) {
      text(`${v * 100}%`, 35, y(v) + 4, "#b6c5dc", 11, "right");
      line(42, y(v), w - 28, y(v), "#283850", 1);
    }
    for (const v of [12, 16, 20]) text(v, x(v), h - 28, "#b6c5dc", 11);
    s.designs.forEach((d) =>
      dot(
        x(d.cost),
        y(d.service),
        d.selected ? 9 : 5,
        d.selected ? palette[3] : d.front ? palette[2] : "#52657e",
      ),
    );
    text("Link cost →", w / 2, h - 12, "#b6c5dc");
    text("Delivered fraction ↑", w / 2, 22, "#b6c5dc");
    return;
  }
  text("Experiment ready", w / 2, h / 2);
}
