// ==UserScript==
// @name         Shlink Toolkit
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Bypasses pagination to load all items simultaneously and standardizes date and time formats globally.
// @author       Daniel Josue Rozo Vargas - www.danielrozo.com
// @match        https://app.shlink.io/*
// @icon         https://app.shlink.io/icons/icon-310x310.png
// @updateURL    https://raw.githubusercontent.com/danielrozocom/shlink-toolkit/main/shlink-toolkit.user.js
// @downloadURL  https://raw.githubusercontent.com/danielrozocom/shlink-toolkit/main/shlink-toolkit.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // Intercept fetch requests (handling string, Request object, or URL)
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        let [resource, config] = args;

        try {
            let urlString = '';
            let isRequestInstance = false;

            if (typeof resource === 'string') {
                urlString = resource;
            } else if (resource instanceof Request) {
                urlString = resource.url;
                isRequestInstance = true;
            } else if (resource instanceof URL) {
                urlString = resource.toString();
            }

            if (urlString && urlString.includes('/rest/v3/short-urls')) {
                const urlObj = new URL(urlString, window.location.origin);
                // Force high itemsPerPage to load everything on a single page, bypassing pagination
                urlObj.searchParams.set('itemsPerPage', '1000');
                
                const modifiedUrl = urlObj.toString();
                if (isRequestInstance) {
                    resource = new Request(modifiedUrl, resource);
                } else {
                    resource = modifiedUrl;
                }
            }
        } catch (e) {
            console.error('[Shlink Toolkit] Error modifying fetch request:', e);
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

        let rawDateStr = targetElement.getAttribute('data-shlink-raw-date');

        if (!rawDateStr) {
            if (targetElement.tagName === 'TIME' && targetElement.hasAttribute('datetime')) {
                rawDateStr = targetElement.getAttribute('datetime');
            } else if (targetElement.hasAttribute('title') && targetElement.getAttribute('title')) {
                rawDateStr = targetElement.getAttribute('title');
            } else {
                rawDateStr = targetElement.textContent.trim();
            }

            if (rawDateStr) {
                targetElement.setAttribute('data-shlink-raw-date', rawDateStr);
            }
        }

        if (!rawDateStr) return;

        let dateObject = !isNaN(rawDateStr) ? new Date(parseInt(rawDateStr, 10)) : new Date(rawDateStr);

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
     * Scans and formats all date cells, time tags, and timestamp elements in the current view
     */
    function processGlobalDates() {
        const matchingElements = document.querySelectorAll(
            'time, td[data-column*="Created" i], td[data-column*="Fecha" i], td[data-column*="date" i], [title*="202"], [datetime]'
        );
        matchingElements.forEach(element => {
            formatDateTimeElement(element);
        });
    }

    let isScheduled = false;
    function scheduleDateProcessing() {
        if (!isScheduled) {
            isScheduled = true;
            requestAnimationFrame(() => {
                processGlobalDates();
                isScheduled = false;
            });
        }
    }

    // Initialize observer once DOM starts becoming available
    function setupObserver() {
        const targetNode = document.body || document.documentElement;
        if (!targetNode) return;

        const domObserver = new MutationObserver(() => {
            scheduleDateProcessing();
        });

        domObserver.observe(targetNode, {
            childList: true,
            subtree: true,
            characterData: true
        });

        scheduleDateProcessing();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupObserver);
    } else {
        setupObserver();
    }

    // Periodic safety sweep for SPA transitions and slow network responses
    setInterval(processGlobalDates, 1500);

})();