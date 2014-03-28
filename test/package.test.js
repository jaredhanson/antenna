/* global describe, it, expect */

var antenna = require('..');

describe('antenna', function() {
  
  it('should export function', function() {
    expect(antenna).to.be.a('function');
  });
  
  it('should export create', function() {
    expect(antenna.create).to.be.a('function');
    expect(antenna.create).to.equal(antenna);
  });
  
});
