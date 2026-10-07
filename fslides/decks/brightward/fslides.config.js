module.exports = {
  style: 'brightward',
  name: 'brightward-streaming',
  title: 'Brightward Streaming: evidence to a supported next step',

  // Slide filenames in order, relative to the slides/ directory
  slides: [
    '01-situation.html',
    '02-platform.html',
    '03-value.html',
    '04-next-steps.html',
  ],

  // Human-readable labels for the overview panel (must match slides array length)
  labels: [
    'The situation',
    'The OpenAI Platform & API',
    'Value and guardrails',
    'Next steps and recap',
  ],

  // density: { default: 3 },  // content-density dial (1–5) in the player; author with data-d / data-dmax

  // liveReload: false,  // fslides serve: disable SSE reload (or open with ?noreload=1)

  // Optional: per-slide PDF overrides
  // pdfOverrides: {
  //   'my-animated-slide.html': {
  //     wait: 5000,   // extra ms to wait before capturing
  //     extra: `document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));`
  //   }
  // },
};
