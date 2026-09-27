// Keep outcomes readable; exact observables remain available through Measurements.
export function readerFeedback(id, raw = "") {
  if (id === "node-capacity")
    return "A node is a simplified view of a person, not the whole person.";
  if (id === "intro") return raw;
  if (id === "node-limits")
    return (
      raw ||
      "Better conditions can change what is possible. This picture uses an illustrative limit."
    );
  if (id === "alignment") {
    const r = Number(raw.match(/R = ([\d.]+)/)?.[1]);
    return r > 0.75
      ? "Most directions now agree. Agreement alone does not make the goal right."
      : r > 0.35
        ? "Some directions are coming together. Others still differ."
        : "People are pulling in different directions. Try bringing neighbours together.";
  }
  if (id === "entropy") {
    const error = raw.match(/decoded errors (\d+)\/(\d+)/);
    if (error)
      return Number(error[1]) === 0
        ? "This message arrived intact. Another attempt may turn out differently."
        : `${error[1]} of ${error[2]} bits changed. Extra copies can help, but do not guarantee success.`;
    if (raw.includes("Transmitting"))
      return "The message is travelling. Changes to the settings affect the next message.";
    return "A clear-looking connection can still carry an error. Send a message to find out.";
  }
  if (id === "collective-memory") {
    const n = Number(raw.match(/copies (\d+)/)?.[1]);
    if (raw.includes("LOST"))
      return "No surviving copy remains. This idea has been lost here.";
    if (raw.includes("origin gone"))
      return "The original carrier is gone. The idea survives in someone else.";
    return n > 1
      ? "The idea now has more than one home. Try removing its origin."
      : n === 1
        ? "One person holds the idea. Wait for it to spread."
        : "Create an idea and watch it find other carriers.";
  }
  if (id === "emergent-organism")
    return raw.includes("removed")
      ? "The person is gone. Look at which connections and paths remain."
      : "The same removal can matter differently depending on the person’s connections.";
  if (id === "node-quantity") {
    const n = raw.match(/^(\d+) nodes/);
    return n
      ? `${n[1]} people in this picture. More people bring potential—and more to coordinate.`
      : "Change the size of the network.";
  }
  const messages = {
    "connection-quantity":
      "Shortcuts can bring distant groups closer. They do not create unlimited attention.",
    "connection-quality":
      "Watch which messages spread clearly and which become corrupted.",
    cohesion:
      "The contact rule shapes whose opinions can influence whom. Contact is not a guaranteed cure for conflict.",
    "illusion-of-significance": raw.startsWith("averaging")
      ? "Here, a difference spreads out and can leave a small trace."
      : "Here, a tiny difference can grow. Make one change and compare the two futures.",
    environment:
      "New information enters through people who encounter it. Then it can spread.",
    "external-storage":
      "An idea can outlive its first carrier when it has another place to live.",
    productivity:
      "More people, more capacity, new connections. Several changes contribute to this picture.",
    "comparative-emergence":
      "Compare the pattern. Similar behaviour does not make two systems the same.",
    "whats-next":
      "Every view leaves something out. What would you change—and what might it cost?",
  };
  return messages[id] || "";
}
