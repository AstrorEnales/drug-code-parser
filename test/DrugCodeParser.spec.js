// eslint-disable-next-line no-use-before-define
if (typeof DrugCodeParser === 'undefined') {
  var DrugCodeParser = require('..');
}

const rsChar = String.fromCharCode(30);
const gsChar = String.fromCharCode(29);
const eotChar = String.fromCharCode(4);
const ifaPpnDataMatrixPpn = '[)>' + rsChar + '06' + gsChar + '9N110375286414' + rsChar + eotChar;
const ifaPpnDataMatrixExpires = '[)>' + rsChar + '06' + gsChar + 'D150600' + rsChar + eotChar;
const ifaPpnDataMatrixExpiresDay = '[)>' + rsChar + '06' + gsChar + 'D150604' + rsChar + eotChar;
const ifaPpnDataMatrixProduction = '[)>' + rsChar + '06' + gsChar + '16D20151100' + rsChar + eotChar;
const ifaPpnDataMatrixProductionDay = '[)>' + rsChar + '06' + gsChar + '16D20151106' + rsChar + eotChar;
const ifaPpnDataMatrixBatch = '[)>' + rsChar + '06' + gsChar + '1T12345ABCD' + rsChar + eotChar;
const ifaPpnDataMatrixSerial = '[)>' + rsChar + '06' + gsChar + 'S12345ABCDEF98765' + rsChar + eotChar;
const ifaPpnDataMatrixGtin = '[)>' + rsChar + '06' + gsChar + '8P04150047759334' + rsChar + eotChar;
const ifaPpnDataMatrixCombined = '[)>' + rsChar + '06' +
  gsChar + '9N110375286414' +
  gsChar + '1T12345ABCD' +
  gsChar + 'D150600' +
  gsChar + 'S12345ABCDEF98765' +
  rsChar + eotChar;

describe('parseIFAPPN', function() {
  it('should not throw ParseException', function() {
    expect(function() { DrugCodeParser.parseIFAPPN(ifaPpnDataMatrixCombined); }).not.toThrow();
  });
  it('should throw ParseException', function() {
    expect(function() { DrugCodeParser.parseIFAPPN(); }).toThrow();
    expect(function() { DrugCodeParser.parseIFAPPN(''); }).toThrow();
    expect(function() { DrugCodeParser.parseIFAPPN('ABC'); }).toThrow();
    expect(function() { DrugCodeParser.parseIFAPPN('[))' + rsChar + '0000'); }).toThrow();
    expect(function() { DrugCodeParser.parseIFAPPN('[)>' + rsChar + '0000'); }).toThrow();
  });
  it('should parse correct serial number data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifaPpnDataMatrixSerial);
    expect(real.serial).toBe('12345ABCDEF98765');
  });
  it('should parse correct batch number data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifaPpnDataMatrixBatch);
    expect(real.batch).toBe('12345ABCD');
  });
  it('should parse correct PPN data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifaPpnDataMatrixPpn);
    expect(real.ppn.value).toBe('110375286414');
    expect(real.ppn.valid).toBeTruthy();
    expect(real.pzn.value).toBe('03752864');
    expect(real.pzn.valid).toBeTruthy();
  });
  it('should parse correct expiration date data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifaPpnDataMatrixExpires);
    expect(real.expirationDate).toBe('2015-06');
  });
  it('should parse correct expiration date with day data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifaPpnDataMatrixExpiresDay);
    expect(real.expirationDate).toBe('2015-06-04');
  });
  it('should parse correct production date data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifaPpnDataMatrixProduction);
    expect(real.productionDate).toBe('2015-11');
  });
  it('should parse correct production date with day data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifaPpnDataMatrixProductionDay);
    expect(real.productionDate).toBe('2015-11-06');
  });
  it('should parse correct GTIN/NTIN with day data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifaPpnDataMatrixGtin);
    expect(real.gtin).toBe('04150047759334');
  });
  it('should parse correct combined data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifaPpnDataMatrixCombined);
    expect(real.ppn.value).toBe('110375286414');
    expect(real.ppn.valid).toBeTruthy();
    expect(real.pzn.value).toBe('03752864');
    expect(real.pzn.valid).toBeTruthy();
    expect(real.batch).toBe('12345ABCD');
    expect(real.expirationDate).toBe('2015-06');
    expect(real.serial).toBe('12345ABCDEF98765');
  });
});

describe('validatePPN', function() {
  it('should detect valid PPN codes', function() {
    expect(DrugCodeParser.validatePPN('110375286414')).toBeTruthy();
    expect(DrugCodeParser.validatePPN('110375287077')).toBeTruthy();
  });
  it('should detect invalid PPN codes', function() {
    expect(DrugCodeParser.validatePPN()).toBeFalsy();
    expect(DrugCodeParser.validatePPN('')).toBeFalsy();
    expect(DrugCodeParser.validatePPN('ABC')).toBeFalsy();
    expect(DrugCodeParser.validatePPN('111111111111')).toBeFalsy();
  });
});

describe('validatePZN', function() {
  it('should detect valid PZN codes', function() {
    expect(DrugCodeParser.validatePZN('03752864')).toBeTruthy();
    expect(DrugCodeParser.validatePZN('03752870')).toBeTruthy();
  });
  it('should detect invalid PZN codes', function() {
    expect(DrugCodeParser.validatePZN()).toBeFalsy();
    expect(DrugCodeParser.validatePZN('')).toBeFalsy();
    expect(DrugCodeParser.validatePZN('ABC')).toBeFalsy();
    expect(DrugCodeParser.validatePZN('1111111')).toBeFalsy();
    expect(DrugCodeParser.validatePZN('11111111')).toBeFalsy();
  });
});
