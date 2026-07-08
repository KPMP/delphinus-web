export const normalizeParticipants = (participants) => {
    if (Array.isArray(participants)) {
        return participants;
    }

    if (participants && typeof participants === 'object') {
        if (Array.isArray(participants.participants)) {
            return participants.participants;
        }

        if (Array.isArray(participants.data)) {
            return participants.data;
        }
    }

    return [];
};
