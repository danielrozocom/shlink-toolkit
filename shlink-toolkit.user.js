// ==UserScript==
// @name         Shlink Toolkit
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Bypasses pagination to load all items simultaneously and standardizes date and time formats globally.
// @author       Daniel Josue Rozo Vargas - www.danielrozo.com
// @match        https://app.shlink.io/*
// @icon         https://app.shlink.io/icons/icon-310x310.png
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // Intercept fetch requests to force itemsPerPage parameter for short-urls listing
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        let [resource, config] = args;

        if (typeof resource === 'string' && resource.includes('/rest/v3/short-urls')) {
            const urlObj = new URL(resource, window.location.origin);
            // Force high itemsPerPage to load everything on a single page, bypassing pagination
            urlObj.searchParams.set('itemsPerPage', '1000');
            resource = urlObj.toString();
        }

        return originalFetch.apply(this, [resource, config]);
    };

    // Global configuration constants for formatting
    const MONTH_NAMES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

    /**
     * Converts a given date or time element into the target format: DD/MMM/YYYY HH:mm a. m./p. m.
     */
    function formatDateTimeElement(targetElement) {
        if (!targetElement) return;

        let dateObject = null;
        const originalText = targetElement.textContent.trim();

        if (targetElement.tagName === 'TIME' && targetElement.hasAttribute('datetime')) {
            const datetimeValue = targetElement.getAttribute('datetime');
            dateObject = !isNaN(datetimeValue) ? new Date(parseInt(datetimeValue, 10)) : new Date(datetimeValue);
        } else if (originalText) {
            dateObject = new Date(originalText);
        }

        if (dateObject && !isNaN(dateObject.getTime())) {
            const day = String(dateObject.getDate()).padStart(2, '0');
            const month = MONTH_NAMES[dateObject.getMonth()];
            const year = dateObject.getFullYear();

            let hours = dateObject.getHours();
            const minutes = String(dateObject.getMinutes()).padStart(2, '0');
            const timeSuffix = hours >= 12 ? 'p. m.' : 'a. m.';

            hours = hours % 12;
            hours = hours ? hours : 12;
            const formattedHours = String(hours).padStart(2, '0');

            const formattedResult = `${day}/${month}/${year} ${formattedHours}:${minutes} ${timeSuffix}`;

            if (targetElement.textContent !== formattedResult) {
                targetElement.textContent = formattedResult;
            }
        }
    }

    /**
     * Scans and formats all date cells and time tags in the current view
     */
    function processGlobalDates() {
        const matchingElements = document.querySelectorAll('time, td[data-column*="Created"], td[data-column*="Fecha"]');
        matchingElements.forEach(element => {
            formatDateTimeElement(element);
        });
    }

    // DOM MutationObserver setup once body is available
    window.addEventListener('DOMContentLoaded', () => {
        const domObserver = new MutationObserver((mutationsList) => {
            let hasNewNodes = false;
            mutationsList.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    hasNewNodes = true;
                }
            });

            if (hasNewNodes) {
                processGlobalDates();
            }
        });

        domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    // Fallback timers for initial asynchronous loads
    window.addEventListener('load', () => {
        setTimeout(processGlobalDates, 500);
        setTimeout(processGlobalDates, 1500);
    });

})();