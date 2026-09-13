/**
 * ============================================================================
 * SPLITTEXT UTILITY
 * Recreates the core behavior of GSAP SplitText without commercial dependencies.
 * Splits target DOM elements into words and lines for staggered reveals.
 * ============================================================================
 */

export class TextSplitter {
  /**
   * @param {HTMLElement|string} target - The DOM element or selector to split.
   * @param {Object} options
   * @param {'words'|'lines'|'chars'} options.type - Split method
   * @param {string} [options.wordsClass] - CSS class for words
   * @param {string} [options.linesClass] - CSS class for lines
   * @param {string} [options.charsClass] - CSS class for chars
   */
  constructor(target, options = {}) {
    this.element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!this.element) return;

    this.options = {
      type: options.type || 'words',
      wordsClass: options.wordsClass || 'split-word',
      linesClass: options.linesClass || 'split-line',
      charsClass: options.charsClass || 'split-char',
      ...options
    };

    this.originalHTML = this.element.innerHTML;
    this.words = [];
    this.lines = [];
    this.chars = [];

    this.split();
  }

  split() {
    const text = this.element.textContent.trim();
    if (!text) return;

    if (this.options.type === 'words') {
      const wordsArr = text.split(/\s+/);
      this.element.innerHTML = wordsArr
        .map(w => `<span class="${this.options.wordsClass}">${w}</span>`)
        .join(' ');
      this.words = Array.from(this.element.querySelectorAll(`.${this.options.wordsClass}`));
    } 
    else if (this.options.type === 'chars') {
      const charsArr = Array.from(text);
      this.element.innerHTML = charsArr
        .map(c => c === ' ' ? ' ' : `<span class="${this.options.charsClass}">${c}</span>`)
        .join('');
      this.chars = Array.from(this.element.querySelectorAll(`.${this.options.charsClass}`));
    }
    else if (this.options.type === 'lines') {
      // Line detection: first wrap words in inline spans to measure their getBoundingClientRect().top
      const words = text.split(/\s+/);
      this.element.innerHTML = words.map(w => `<span>${w} </span>`).join('');
      const wordSpans = Array.from(this.element.children);

      const lineBuckets = [];
      let currentLine = [];
      let lastTop = null;

      wordSpans.forEach(span => {
        const top = span.offsetTop;
        if (lastTop === null || Math.abs(top - lastTop) > 4) {
          if (currentLine.length > 0) lineBuckets.push(currentLine);
          currentLine = [span.textContent];
          lastTop = top;
        } else {
          currentLine.push(span.textContent);
        }
      });
      if (currentLine.length > 0) lineBuckets.push(currentLine);

      // Rebuild HTML wrapped in line containers
      this.element.innerHTML = lineBuckets
        .map(line => `<span class="${this.options.linesClass}">${line.join('')}</span>`)
        .join('');

      this.lines = Array.from(this.element.querySelectorAll(`.${this.options.linesClass}`));
    }
  }

  revert() {
    if (this.element) {
      this.element.innerHTML = this.originalHTML;
    }
  }
}
