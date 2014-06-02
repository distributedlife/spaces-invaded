module.exports = function(x, y, width, height) {
  return {
    cx: x,
    cy: y,
    half_width: width / 2,
    half_height: height / 2,

    left: function() { return this.cx - this.half_width; },
    right: function() { return this.cx + this.half_width; },
    top: function() { return this.cy - this.half_height; },
    bottom: function() {return this.cy + this.half_height; },

    is_colliding_with: function(other_box) {
      if (this === other_box) { return false; }
      if (this.bottom() < other_box.top()) { return false; }
      if (this.top() > other_box.bottom()) { return false; }
      if (this.right() < other_box.left()) { return false; }
      if (this.left() > other_box.right()) { return false; }

      return true;
    }
  };
};