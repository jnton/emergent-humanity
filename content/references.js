// Scoped references: access/review status is explicit, never inferred from a DOI.
export const REFERENCES = {
  emergence: {
    title: "Emergent Properties — Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/properties-emergent/",
    scope:
      "Philosophical distinctions and competing accounts; not experimental proof.",
    status: "Scholarly overview consulted in audit.",
  },
  intentionality: {
    title: "Collective Intentionality — Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/collective-intentionality/",
    scope: "Shared intention, action and belief are distinct questions.",
    status: "Scholarly overview consulted in audit.",
  },
  organismality: {
    title:
      "Queller & Strassmann (2009), Beyond society: the evolution of organismality",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2781869/",
    scope:
      "Cooperation and conflict as dimensions of biological organismality; transfer to humanity is interpretive.",
    status: "Primary source consulted in audit.",
  },
  networks: {
    title: "Broido & Clauset (2019), Scale-free networks are rare",
    url: "https://www.nature.com/articles/s41467-019-08746-5",
    scope:
      "Do not assume one universal empirical network topology. Our graphs are deliberately constructed fixtures.",
    status: "Publisher results consulted in audit.",
  },
  smallworld: {
    title:
      "Watts & Strogatz (1998), Collective dynamics of small-world networks",
    url: "https://doi.org/10.1038/30918",
    scope:
      "Background for local and long-range connectivity. This experiment is not their rewiring algorithm.",
    status:
      "Publisher access blocked during audit; precise paper-level review pending.",
  },
  chaos: {
    title:
      "Eckmann & Ruelle (1985), Ergodic theory of chaos and strange attractors",
    url: "https://doi.org/10.1103/RevModPhys.57.617",
    scope: "Specialist background for stability and chaos terminology.",
    status: "Publisher record consulted; full technical review pending.",
  },
  shannon: {
    title: "Shannon (1948), A Mathematical Theory of Communication",
    url: "https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf",
    scope:
      "Physical channel fidelity, error probabilities, and coding; not semantic truth.",
    status: "Primary paper available and consulted in audit.",
  },
  deffuant: {
    title: "Deffuant et al. (2000), Mixing beliefs among interacting agents",
    url: "https://doi.org/10.1142/S0219525900000078",
    scope:
      "Bounded-confidence family; this project exposes its own update rule explicitly.",
    status:
      "Publisher access blocked during audit; exact model attribution review pending.",
  },
  bail: {
    title:
      "Bail et al. (2018), Exposure to opposing views on social media can increase political polarization",
    url: "https://doi.org/10.1073/pnas.1804840115",
    scope:
      "A particular US Twitter intervention increased polarization among Republican participants; Democratic effect was not significant. Not a universal contact law.",
    status: "Study summary and publisher text consulted in audit.",
  },
  vicsek: {
    title:
      "Vicsek et al. (1995), Novel type of phase transition in a system of self-driven particles",
    url: "https://doi.org/10.1103/PhysRevLett.75.1226",
    scope:
      "Neighborhood heading alignment. Our global mean rule is a different, explicitly generic model.",
    status: "Publisher abstract consulted in audit.",
  },
  lorenz: {
    title:
      "Lorenz et al. (2011), How social influence can undermine the wisdom of crowd effect",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3107299/",
    scope:
      "Specific estimation experiment showing a possible cost of influence, not all social learning.",
    status: "Primary study summary consulted in audit.",
  },
  becker: {
    title:
      "Becker et al. (2017), Network dynamics of social influence in the wisdom of crowds",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5495222/",
    scope:
      "Structure affects when influence improves accuracy; counterweight to universal claims about consensus.",
    status: "Primary article consulted in audit.",
  },
  woolley: {
    title:
      "Woolley et al. (2010), Evidence for a collective intelligence factor in the performance of human groups",
    url: "https://pubmed.ncbi.nlm.nih.gov/20929725/",
    scope:
      "Task performance in groups of two to five; no extrapolation to planetary consciousness.",
    status: "Abstract consulted in audit; full paper-level review pending.",
  },
  ostrom: {
    title:
      "Ostrom (2010), Beyond Markets and States: Polycentric Governance of Complex Economic Systems",
    url: "https://www.aeaweb.org/articles?id=10.1257%2Faer.100.3.641",
    scope:
      "Institutions and governance matter beyond graph structure; no universal optimal institution.",
    status:
      "Source identified in audit; detailed passage-level review pending.",
  },
  tero: {
    title:
      "Tero et al. (2010), Rules for biologically inspired adaptive network design",
    url: "https://pubmed.ncbi.nlm.nih.gov/20093467/",
    scope:
      "Motivates transport-cost/failure comparisons. A ring graph is not a physiological model of Physarum.",
    status: "Abstract consulted in audit; full model review pending.",
  },
};
