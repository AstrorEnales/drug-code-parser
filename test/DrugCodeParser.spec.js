if (typeof DrugCodeParser === 'undefined') {
  var DrugCodeParser = require('..');
}

const rs_char = String.fromCharCode(30);
const gs_char = String.fromCharCode(29);
const eot_char = String.fromCharCode(4);
const ifa_ppn_datamatrix_ppn = '[)>' + rs_char + '06' + gs_char + '9N110375286414' + rs_char + eot_char;
const ifa_ppn_datamatrix_expires = '[)>' + rs_char + '06' + gs_char + 'D150600' + rs_char + eot_char;
const ifa_ppn_datamatrix_expires_day = '[)>' + rs_char + '06' + gs_char + 'D150604' + rs_char + eot_char;
const ifa_ppn_datamatrix_production = '[)>' + rs_char + '06' + gs_char + '16D20151100' + rs_char + eot_char;
const ifa_ppn_datamatrix_production_day = '[)>' + rs_char + '06' + gs_char + '16D20151106' + rs_char + eot_char;
const ifa_ppn_datamatrix_batch = '[)>' + rs_char + '06' + gs_char + '1T12345ABCD' + rs_char + eot_char;
const ifa_ppn_datamatrix_serial = '[)>' + rs_char + '06' + gs_char + 'S12345ABCDEF98765' + rs_char + eot_char;
const ifa_ppn_datamatrix_gtin = '[)>' + rs_char + '06' + gs_char + '8P04150047759334' + rs_char + eot_char;
const ifa_ppn_datamatrix_combined = '[)>' + rs_char + '06' +
  gs_char + '9N110375286414' +
  gs_char + '1T12345ABCD' +
  gs_char + 'D150600' +
  gs_char + 'S12345ABCDEF98765' +
  rs_char + eot_char;

describe('parseIFAPPN', function() {
  it('should not throw ParseException', function() {
    expect(function() { DrugCodeParser.parseIFAPPN(ifa_ppn_datamatrix_combined) }).not.toThrow();
  });
  it('should throw ParseException', function() {
    expect(function() { DrugCodeParser.parseIFAPPN() }).toThrow();
    expect(function() { DrugCodeParser.parseIFAPPN('') }).toThrow();
    expect(function() { DrugCodeParser.parseIFAPPN('ABC') }).toThrow();
    expect(function() { DrugCodeParser.parseIFAPPN('[))' + rs_char + '0000') }).toThrow();
    expect(function() { DrugCodeParser.parseIFAPPN('[)>' + rs_char + '0000') }).toThrow();
  });
  it('should parse correct serial number data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifa_ppn_datamatrix_serial);
    expect(real.serial).toBe('12345ABCDEF98765');
  });
  it('should parse correct batch number data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifa_ppn_datamatrix_batch);
    expect(real.batch).toBe('12345ABCD');
  });
  it('should parse correct PPN data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifa_ppn_datamatrix_ppn);
    expect(real.ppn.value).toBe('110375286414');
    expect(real.ppn.valid).toBeTruthy();
    expect(real.pzn.value).toBe('03752864');
    expect(real.pzn.valid).toBeTruthy();
  });
  it('should parse correct expiration date data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifa_ppn_datamatrix_expires);
    expect(real.expiration_date).toBe('2015-06');
  });
  it('should parse correct expiration date with day data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifa_ppn_datamatrix_expires_day);
    expect(real.expiration_date).toBe('2015-06-04');
  });
  it('should parse correct production date data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifa_ppn_datamatrix_production);
    expect(real.production_date).toBe('2015-11');
  });
  it('should parse correct production date with day data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifa_ppn_datamatrix_production_day);
    expect(real.production_date).toBe('2015-11-06');
  });
  it('should parse correct GTIN/NTIN with day data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifa_ppn_datamatrix_gtin);
    expect(real.gtin_ntin).toBe('04150047759334');
  });
  it('should parse correct combined data matrix result', function() {
    const real = DrugCodeParser.parseIFAPPN(ifa_ppn_datamatrix_combined);
    expect(real.ppn.value).toBe('110375286414');
    expect(real.ppn.valid).toBeTruthy();
    expect(real.pzn.value).toBe('03752864');
    expect(real.pzn.valid).toBeTruthy();
    expect(real.batch).toBe('12345ABCD');
    expect(real.expiration_date).toBe('2015-06');
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
