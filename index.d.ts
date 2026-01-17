export interface SolidProfile {
    name: string;
    email: string;
    birthday: string;
    photoUrl: string | null;
}

export class SolidBusinessCard extends HTMLElement {
    static get observedAttributes(): string[];

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;

    fetchProfile(profileUrl: string): Promise<void>;
}

declare global {
    interface HTMLElementTagNameMap {
        'vcard-business-card': SolidBusinessCard;
    }
}

