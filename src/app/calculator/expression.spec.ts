import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialSign } from 'app/models/special_sign';
import { Expression } from './expression';

describe('Expression', () => {
    let sut: Expression;
    
    // simplest test 
    it('Expression Test: 3+2', () => {
        const mockData = "3+2"
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(5);
    });

    // simplest twat with brackets
    it('Expression Test: (3+2)', () => {
        const mockData = "(3+2)"
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(5);
    });

    // simplest error test with brackets
    it('Expression Test: (3+2', () => {
        const mockData = "(3+2"
        sut = new Expression();
        expect( function() {
            sut = new Expression(mockData);
        }).toThrowError(); 
    });

    // test with brackets priority
    it('Expression Test: 6x(3+2)', () => {
        const mockData = "6x(3+2)"
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(30);
    });

    // test division 
    it('Expression Test: 20÷3', () => {
        const mockData = "20÷3"
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(20/3);
    });

    // test brackets multiplication without sign *  
    it('Expression Test: 2(1+2)3', () => {
        const mockData = "2(1+2)3"
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(18);
    });

    // test operation with -sign number
    it('Expression Test: 14--13', () => {
        const mockData = "14--13"
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(27);
    });

    // test operation division by zero
    it('Expression Test: 10÷0', () => {
        const mockData = "10÷0";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(10/0);
    });

    // test operation with special sign π
    it('Expression Test: with π', () => {
        const mockData = "πx3";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(Math.PI*3);
    });

    it('Expression Test: with π and without signs', () => {
        const mockData = "2π2";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(2*Math.PI*2);
    });

    it('Expression Test: with e ', () => {
        const mockData = "2+e÷(2x3)÷12x4";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(2+Math.E/(2*3)/12*4);
    });

    it('Expression Test: with dicimal number with dot', () => {
        const mockData = "2,";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(2);
    });

    it('Expression Test: with dicimal number with dot', () => {
        const mockData = "2,"
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(2);
    });

    it('Expression Test: 2,e', () => {
        const mockData = "2,e"
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(2*Math.E);
    });


    // test many  operation
    it('Expression Test: 2^6', () => {
        const mockData = "2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2"
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(64);
    });

    // test with error 3 operations
    it('Expression Test: 3+-+3', () => {
        const mockData = "3+-+3"
        expect( function() {
            sut = new Expression(mockData);
        }).toThrowError(); 
    });

    it('Expression Test: ()3+3', () => {
        const mockData = "()3+3"
        expect( function() {
            sut = new Expression(mockData);
        }).toThrowError(); 
    });

    // проверка коммутативности 
    it('Expression Test: Associative property 3+4', () => {
        let mockData = "3+4";
        const mockData2 = "4+3";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        sut = new Expression(mockData2);
        const result2 = sut.calculateExpression();
        expect(result).toBe(result2);
    });

    // проверка коммутативности 
    it('Expression Test: Associative property 3*4', () => {
        let mockData = "3*4";
        const mockData2 = "4*3";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        sut = new Expression(mockData2);
        const result2 = sut.calculateExpression();
        expect(result).toBe(result2);
    });

    // проверка коммутативности 
    it('Expression Test: Associative property 3-4', () => {
        let mockData = "3-4";
        const mockData2 = "4-3";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        sut = new Expression(mockData2);
        const result2 = sut.calculateExpression();
        expect(result==result2).toBeFalse();
    });

    // проверка коммутативности 
    it('Expression Test: Associative property 3/4', () => {
        let mockData = "3/4";
        const mockData2 = "4/3";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        sut = new Expression(mockData2);
        const result2 = sut.calculateExpression();
        expect(result==result2).toBeFalse();
    });

    // проверка ассоциативности 
    it('Expression Test: Associative property 2+3+4', () => {
        let mockData = "(2+3)+4";
        const mockData2 = "2+(3+4)";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        sut = new Expression(mockData2);
        const result2 = sut.calculateExpression();
        expect(result).toBe(result2);
    });

    // проверка ассоциативности 
    it('Expression Test: Associative property 2*3*4', () => {
        let mockData = "(2*3)*4";
        const mockData2 = "2*(3*4)";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        sut = new Expression(mockData2);
        const result2 = sut.calculateExpression();
        expect(result).toBe(result2);
    });

    // проверка ассоциативности 
    it('Expression Test: Associative property 2/3/4', () => {
        let mockData = "(2/3)/4";
        const mockData2 = "2/(3/4)";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        sut = new Expression(mockData2);
        const result2 = sut.calculateExpression();
        expect(result==result2).toBeFalse();
    });

    // проверка ассоциативности 
    it('Expression Test: Associative property 2-3-4', () => {
        let mockData = "(2-3)-4";
        const mockData2 = "2-(3-4)";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        sut = new Expression(mockData2);
        const result2 = sut.calculateExpression();
        expect(result==result2).toBeFalse();
    });
    
    // проверка 0на нейтральный элемент
    it('Expression Test: Identity element 0', () => {
        let mockData = "5+0";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(5);
    });

    // проверка 0на нейтральный элемент
    it('Expression Test: Identity element 0', () => {
        let mockData = "5-0";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(5);
    });

    // проверка на нейтральный элемент
    it('Expression Test: Identity element 1', () => {
        let mockData = "5*1";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(5);
    });

    // проверка на нейтральный элемент
    it('Expression Test: Identity element 1', () => {
        let mockData = "5/1";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result).toBe(5);
    });

    // проверка на нейтральный элемент
    it('Expression Test: Identity element 0', () => {
        let mockData = "5*0";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result==5).toBeFalse();
    });

    // проверка на нейтральный элемент
    it('Expression Test: Identity element 0', () => {
        let mockData = "5/0";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result==5).toBeFalse();
    });

    // проверка на нейтральный элемент
    it('Expression Test: Identity element 0', () => {
        let mockData = "5+1";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result==5).toBeFalse();
    });

    // проверка на нейтральный элемент
    it('Expression Test: Identity element 0', () => {
        let mockData = "5-1";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result==5).toBeFalse();
    });

    // проверка на обратимость
    it('Expression Test: 5*(1/5)', () => {
        let mockData = "5*(1/5)";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result==1).toBeTrue();
    });

    // проверка на обратимость
    it('Expression Test: 5-5', () => {
        let mockData = "5-5";
        sut = new Expression(mockData);
        const result = sut.calculateExpression();
        expect(result==0).toBeTrue();
    });


    




});