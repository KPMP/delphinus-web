import { normalizeParticipants } from './participantListHelpers';

describe('normalizeParticipants', () => {
    it('returns an array when the payload is already an array', () => {
        const input = [{ kpmpId: '1', label: 'One' }];
        expect(normalizeParticipants(input)).toEqual(input);
    });

    it('extracts an array from an object wrapper', () => {
        const input = { participants: [{ kpmpId: '2', label: 'Two' }] };
        expect(normalizeParticipants(input)).toEqual(input.participants);
    });

    it('returns an empty array for invalid values', () => {
        expect(normalizeParticipants(undefined)).toEqual([]);
        expect(normalizeParticipants(null)).toEqual([]);
        expect(normalizeParticipants({})).toEqual([]);
    });
});
