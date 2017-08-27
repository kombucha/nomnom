export const getScrollPercent = () => {
  if (!global.document) {
    return 0;
  }

  var h = global.document.documentElement,
    b = global.document.body,
    st = "scrollTop",
    sh = "scrollHeight";
  const scrollPercent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;

  return Math.round(scrollPercent);
};

export const setScrollPercent = percent => {
  if (!global.document) {
    return;
  }
  global.scrollTo(
    0,
    (global.document.body.scrollHeight - global.document.documentElement.clientHeight) * percent
  );
};
