import orderBy from 'lodash/orderBy';

function participantSelectSorter(slides, orderFields = ['slideName'], orderByFields = ['asc'] ) {
    return orderBy(slides, orderFields, orderByFields);
}

export default participantSelectSorter;