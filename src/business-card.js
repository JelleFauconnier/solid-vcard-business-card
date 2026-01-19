import {
    getSolidDataset,
    getThingAll,
    getStringNoLocale,
    getUrl,
} from "@inrupt/solid-client";
import { VCARD } from "@inrupt/vocab-common-rdf";

export class SolidBusinessCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._profile = null;
    }

    static get observedAttributes() {
        return ['src'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src' && oldValue !== newValue) {
            this.fetchProfile(newValue);
        }
    }

    async connectedCallback() {
        this.renderLoading();

        const src = this.getAttribute('src');
        if (src) {
            await this.fetchProfile(src);
        }
    }

    async fetchProfile(profileUrl) {
        if (!profileUrl) return;

        try {
            const dataset = await getSolidDataset(profileUrl.trim());
            const things = getThingAll(dataset);

            let profileThing = null;
            for (const thing of things) {
                const name = getStringNoLocale(thing, VCARD.fn);
                if (name) {
                    profileThing = thing;
                    break;
                }
            }

            if (!profileThing) {
                throw new Error("No profile found in dataset");
            }


            const name = getStringNoLocale(profileThing, VCARD.fn) || "Unknown Name";

            const emailUrl = getUrl(profileThing, VCARD.hasEmail);

            const email = emailUrl ? emailUrl.replace("mailto:", "") : "";

            const birthday = getStringNoLocale(profileThing, VCARD.bday) || "";

            const photoUrl = getUrl(profileThing, VCARD.hasPhoto);

            this._profile = {
                name,
                email,
                birthday,
                photoUrl
            };

            this.render();

        } catch (error) {
            console.error("Error loading Solid profile:", error);
            this.renderError(error);
        }
    }


    renderLoading() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                
                :host {
                    display: inline-block;
                }
                .business-card {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #ffffff;
                    border-radius: 0.5rem;
                    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
                    padding: 2rem;
                    width: 25rem;
                    min-height: 12.5rem;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0.625rem;
                    border: 0.0625rem solid #e5e7eb;
                }
                .business-card__loading {
                    color: #6b7280;
                    font-size: 0.875rem;
                    font-weight: 400;
                }
            </style>
            <div class="business-card">
                <div class="business-card__loading">Loading profile...</div>
            </div>
        `;
    }

    render() {
        if (!this._profile) return;

        const {name, email, birthday, photoUrl} = this._profile;

        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                
                :host {
                    display: inline-block;
                }
                .business-card {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #ffffff;
                    border-radius: 0.5rem;
                    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
                    padding: 2rem;
                    width: 25rem;
                    min-height: 12.5rem;
                    box-sizing: border-box;
                    position: relative;
                    overflow: hidden;
                    transition: box-shadow 0.2s ease, transform 0.2s ease;
                    margin: 0.625rem;
                    border: 0.0625rem solid #e5e7eb;
                }         
                
                .business-card__content {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    justify-content: space-between;
                    padding-right: 6rem;
                }
                
                .business-card__header {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 0.0625rem solid #e5e7eb;
                }
                
                .business-card__name {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #111827;
                    margin: 0;
                }
                
                .business-card__picture {
                    position: absolute;
                    top: 2rem;
                    right: 2rem;
                    width: 5rem;
                    height: 5rem;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 0.125rem solid #e5e7eb;
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
                }
                
                .business-card__picture img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .business-card__footer {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }
                
                .business-card__contact {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #4b5563;
                    font-size: 0.875rem;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                
                .business-card__contact:hover {
                    color: #111827;
                }
                
                .business-card__label {
                    font-size: 0.75rem;
                    color: #757575;
                    text-transform: uppercase;
                    letter-spacing: 0.03125rem;
                    margin-bottom: 0.125rem;
                }
                
                .business-card__value {
                    font-size: 0.875rem;
                    color: #4b5563;
                }
            </style>
            <div class="business-card">
                <div class="business-card__picture">
                    <img src="${photoUrl}" alt="Profile picture">
                </div>
                <div class="business-card__content">
                    <div class="business-card__header">
                        <h3 class="business-card__name">${name}</h3>
                    </div>
                    
                    <div class="business-card__footer">
                        ${email ? `
                            <div>
                                <div class="business-card__label">Email</div>
                                <a class="business-card__contact" href="mailto:${email}">${email}</a>
                            </div>
                        ` : ''}
                        ${birthday ? `
                        <div>
                            <div class="business-card__label">Birthday</div>
                            <div class="business-card__value">${birthday}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderError(error) {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                
                :host {
                    display: inline-block;
                }
                .business-card {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #fef2f2;
                    border-radius: 0.5rem;
                    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
                    padding: 2rem;
                    width: 25rem;
                    min-height: 12.5rem;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    margin: 0.625rem;
                    border: 0.0625rem solid #fecaca;
                }
                .business-card__error-title {
                    color: #991b1b;
                    font-weight: 600;
                    margin: 0 0 0.5rem 0;
                    text-align: center;
                    font-size: 1rem;
                }
                .business-card__error-msg {
                    color: #b91c1c;
                    font-size: 0.6875rem;
                    text-align: center;
                    line-height: 1.4;
                    margin: 0;
                }
            </style>
            <div class="business-card">
                <h4 class="business-card__error-title">Error Loading Profile</h4>
                <p class="business-card__error-msg">${error.message}</p>
            </div>
        `;
    }
}

customElements.define('solid-business-card', SolidBusinessCard);

