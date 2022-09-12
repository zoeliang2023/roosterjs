import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { FormatHandler } from '../../../lib/formatHandlers/FormatHandler';
import { parseFormat } from '../../../lib/domToModel/utils/parseFormat';

describe('parseFormat', () => {
    const defaultContext = createDomToModelContext();

    it('empty handlers', () => {
        const element = document.createElement('div');
        const handlers: FormatHandler<any>[] = [];
        const format = {};

        parseFormat(element, handlers, format, defaultContext);

        expect(format).toEqual({});
    });

    it('one handlers', () => {
        const element = document.createElement('div');
        const handlers: FormatHandler<any>[] = [
            {
                parse: (format, e, c, defaultStyle) => {
                    expect(e).toBe(element);
                    expect(c).toBe(defaultContext);

                    format.a = 1;
                },
                apply: null!,
            },
        ];
        const format = {};

        parseFormat(element, handlers, format, defaultContext);

        expect(format).toEqual({ a: 1 });
    });
});

describe('Default styles', () => {
    const defaultContext = createDomToModelContext();

    function runTest(tag: string, expectResult: Partial<CSSStyleDeclaration>) {
        const element = document.createElement(tag);
        const handlers: FormatHandler<any>[] = [
            {
                parse: (format, e, c, defaultStyle) => {
                    expect(defaultStyle).toEqual(expectResult);
                    expect(c).toBe(defaultContext);

                    format.a = 1;
                },
                apply: null!,
            },
        ];
        const format = {};

        parseFormat(element, handlers, format, defaultContext);

        expect(format).toEqual({ a: 1 });
    }

    it('Default style for B', () => {
        runTest('b', { fontWeight: 'bold' });
    });

    it('Default style for EM', () => {
        runTest('em', { fontStyle: 'italic' });
    });

    it('Default style for I', () => {
        runTest('i', { fontStyle: 'italic' });
    });

    it('Default style for S', () => {
        runTest('s', { textDecoration: 'line-through' });
    });

    it('Default style for STRIKE', () => {
        runTest('strike', { textDecoration: 'line-through' });
    });

    it('Default style for STRONG', () => {
        runTest('strong', { fontWeight: 'bold' });
    });

    it('Default style for U', () => {
        runTest('u', { textDecoration: 'underline' });
    });
});
