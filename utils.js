import {useEffect, useLayoutEffect, useState} from "react";
import {createBrowserHistory} from "history";

export const history = typeof window !== 'undefined' ? createBrowserHistory() : {
    location: {search: ''},
    listen: () => {
    },
    push: () => {
    }
};

export const useQueryParams = () => {
    const [queryParams, setQueryParams] = useState(getQueryParamsObject(history.location.search));

    useEffect(() => {
        function listener({location}) {
            setQueryParams(getQueryParamsObject(location.search));
        }

        let unlisten = history.listen(listener);

        return () => unlisten();
    });
    return queryParams;
}

export const getQueryParamsObject = (searchString) => {
    let pairs = searchString.substring(1).split("&");
    let obj = {};
    let pair;

    function getValue(valueString) {
        if (valueString.includes('[')) {
            valueString = valueString.replace('[', '');
            valueString = valueString.replace(']', '');
            return valueString.split(',').map(value => {
                function isNumeric(num) {
                    return !isNaN(num)
                }

                if (isNumeric(value)) return +value;
                return value;
            });
        }
        return pair[1];
    }

    for (let i in pairs) {
        if (pairs[i] === "") continue;

        pair = pairs[i].split("=");
        let value = getValue(decodeURIComponent(pair[1]));
        obj[decodeURIComponent(pair[0])] = value;
    }

    return obj;
}

export const setQueryParam = (key, value) => {
    history.push({search: `?${encodeURIComponent(key)}=${encodeURIComponent(value)}`, pathname: ''})
}


export function useWindowSize(ssrWorking) {
    let [size, setSize] = useState([0, 0]);
    if (!ssrWorking) {
        useLayoutEffect(() => {
            function updateSize() {
                setSize([(window.clientWidth || window.scrollWidth || window.innerWidth), (window.clientHeight || window.scrollHeight || window.innerHeight) - 8]);
            }

            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
        }, []);
    }
    return size;
}
