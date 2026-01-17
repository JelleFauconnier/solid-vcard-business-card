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

        // Start periodic gradient animation
        this.startGradientAnimation();
    }

    disconnectedCallback() {
        if (this._animationInterval) {
            clearInterval(this._animationInterval);
        }
    }

    startGradientAnimation() {
        // Run animation every 10 seconds
        this._animationInterval = setInterval(() => {
            this.animateGradient();
        }, 10000);

        // Run initial animation after component loads
        setTimeout(() => this.animateGradient(), 500);
    }

    animateGradient() {
        const nameElement = this.querySelector('.business-card__name');
        if (!nameElement) return;

        let position = -200;
        const duration = 1000; // 2 seconds for the shimmer to pass
        const steps = 60;
        const stepDuration = duration / steps;
        const positionIncrement = 200 / steps; // Move from -100 to 100

        const animate = () => {
            if (position >= 200) {
                nameElement.style.backgroundPosition = '-200% 0%';
                return;
            }

            nameElement.style.backgroundPosition = `${position}% 0%`;
            position += positionIncrement;

            setTimeout(animate, stepDuration);
        };

        animate();
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
        this.innerHTML = `
            <style>
                .business-card {
                    font-family: 'Georgia', 'Times New Roman', serif;
                    background: 
                        repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.02) 3px),
                        repeating-linear-gradient(90deg, rgba(0,0,0,0.02) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.02) 3px),
                        #f5f5f0;
                    border-radius: 0.25rem;
                    box-shadow: 
                        0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05),
                        0 0.25rem 1rem rgba(0, 0, 0, 0.08),
                        inset 0 0.0625rem 0.125rem rgba(255, 255, 255, 0.8);
                    padding: 2rem;
                    width: 21.875rem;
                    height: 12.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0.625rem;
                    border: 0.0625rem solid rgba(255, 255, 255, 0.5);
                }
                .business-card__loading {
                    color: #8a8a82;
                    font-size: 0.875rem;
                    font-weight: 400;
                    letter-spacing: 0.0625rem;
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

        this.innerHTML = `
            <style>
                .business-card {
                    font-family: 'Georgia', 'Times New Roman', serif;
                    background: 
                        linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.02) 100%),
                        repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.02) 3px),
                        repeating-linear-gradient(90deg, rgba(0,0,0,0.02) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.02) 3px),
                        #f5f5f0;
                    border-radius: 0.25rem;
                    box-shadow: 
                        0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05),
                        0 0.25rem 1rem rgba(0, 0, 0, 0.08),
                        inset 0 0.0625rem 0.125rem rgba(255, 255, 255, 0.8);
                    padding: 2.5rem;
                    width: 21.875rem;
                    height: 12.5rem;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    margin: 0.625rem;
                    border: 0.0625rem solid rgba(255, 255, 255, 0.5);
                }
                
                .business-card:hover {
                    transform: translateY(-0.1875rem) rotateX(2deg);
                    box-shadow: 
                        0 0.125rem 0.25rem rgba(0, 0, 0, 0.06),
                        0 0.5rem 1.5rem rgba(0, 0, 0, 0.12),
                        inset 0 0.0625rem 0.125rem rgba(255, 255, 255, 0.8);
                }
                
                .business-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: 
                        radial-gradient(circle at 20% 30%, rgba(0,0,0,0.01) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(0,0,0,0.01) 0%, transparent 50%);
                    pointer-events: none;
                }
                
                .business-card__content {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    justify-content: space-between;
                }
                
                .business-card__header {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    padding-bottom: 1rem;
                    border-bottom: 0.0625rem solid rgba(200, 200, 190, 0.3);
                }
                
                .business-card__name {
                    font-size: 2rem;
                    font-weight: 400;
                    font-family: 'Brush Script MT', cursive;
                    background: linear-gradient(90deg, 
                        #aa8b2e 0%, 
                        #d4af37 35%, 
                        #ffecbe 50%, 
                        #d4af37 65%, 
                        #aa8b2e 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    background-size: 200% 100%;
                    background-position: -200% 0%;
                    margin: 0;
                    letter-spacing: 0.0625rem;
                    text-shadow: 
                        0.0625rem 0.0625rem 0.125rem rgba(212, 175, 55, 0.3),
                        -0.0625rem -0.0625rem 0.125rem rgba(255, 255, 255, 0.5);
                    filter: drop-shadow(0 0.0625rem 0.0625rem rgba(0, 0, 0, 0.1));
                    position: relative;
                }
                
                .business-card__name::before {
                    content: '${name}';
                    position: absolute;
                    top: 0.0625rem;
                    left: 0.0625rem;
                    z-index: -1;
                    opacity: 0.3;
                    filter: blur(0.125rem);
                }
                
                .business-card__divider {
                    width: 3.125rem;
                    height: 0.0625rem;
                    background: linear-gradient(90deg, #d4af37 0%, transparent 100%);
                    margin: 0.5rem 0;
                }
                
                .business-card__picture {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    width: 5rem;
                    height: 5rem;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 0.125rem solid rgba(212, 175, 55, 0.4);
                    box-shadow: 
                        0 0.125rem 0.5rem rgba(0, 0, 0, 0.15),
                        inset 0 0 0.25rem rgba(255, 255, 255, 0.3);
                }
                
                .business-card__picture img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .business-card__footer {
                    display: flex;
                    flex-direction: column;
                    gap: 0.375rem;
                }
                
                .business-card__contact {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #5a5a52;
                    font-size: 0.75rem;
                    text-decoration: none;
                    transition: color 0.2s;
                    font-family: 'Segoe UI', sans-serif;
                    letter-spacing: 0.03125rem;
                }
                
                .business-card__contact:hover {
                    color: #d4af37;
                }
                
                .business-card__label {
                    font-size: 0.625rem;
                    color: #8a8a82;
                    text-transform: uppercase;
                    letter-spacing: 0.0625rem;
                    margin-bottom: 0.125rem;
                }
            </style>
            <div class="business-card">
                <div class="business-card__content">
                    <div class="business-card__header">
                        <h3 class="business-card__name">${name}</h3>
                        <div class="business-card__divider"></div>
                    </div>
                    
                    <div class="business-card__picture">
                        <img src="${photoUrl}" alt="Profile picture">
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
                            <div>${birthday}</div>
                        </div>
                        `: ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderError(error) {
        this.innerHTML = `
            <style>
                .business-card {
                    font-family: 'Georgia', 'Times New Roman', serif;
                    background: 
                        repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.02) 3px),
                        repeating-linear-gradient(90deg, rgba(0,0,0,0.02) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.02) 3px),
                        #fef2f2;
                    border-radius: 0.25rem;
                    box-shadow: 
                        0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05),
                        0 0.25rem 1rem rgba(0, 0, 0, 0.08);
                    padding: 2rem;
                    width: 21.875rem;
                    height: 12.5rem;
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
                    letter-spacing: 0.03125rem;
                }
                .business-card__error-msg {
                    color: #b91c1c;
                    font-size: 0.75rem;
                    text-align: center;
                    line-height: 1.4;
                }
            </style>
            <div class="business-card">
                <h4 class="business-card__error-title">Error Loading Profile</h4>
                <p class="business-card__error-msg">${error.message}</p>
            </div>
        `;
    }
}

customElements.define('vcard-business-card', SolidBusinessCard);

