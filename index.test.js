
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
const setUpDOM = () => {
    const dom = new JSDOM(html);
    global.document = dom.window.document;
    global.window = dom.window;
    require('./index');
};

describe('Website Navigation and Hamburger Menu', () => {
    beforeEach(() => {
        setUpDOM();
        const heroSection = document.querySelector('.hero');
        if (heroSection) heroSection.id = 'home';
        setupNavigation(); 
    });

    describe('navigateTo', () => {
        test('should display the specified section and hide others', () => {
            navigateTo('why-choose');
            const homeSection = document.getElementById('home');
            const whyChooseSection = document.getElementById('why-choose');
            const ourStorySection = document.getElementById('our-story');
            expect(whyChooseSection.style.display).toBe('block');
            expect(homeSection.style.display).toBe('none');
            expect(ourStorySection.style.display).toBe('none');
        });

        test('should call showError when sectionId does not exist', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            navigateTo('nonexistent');
            expect(consoleSpy).toHaveBeenCalledWith('Error: Section not found');
            consoleSpy.mockRestore();
        });

        test('should handle index.html as home section', () => {
            navigateTo('index.html');
            const homeSection = document.getElementById('home');
            const whyChooseSection = document.getElementById('why-choose');
            const ourStorySection = document.getElementById('our-story');
            expect(homeSection.style.display).toBe('block');
            expect(whyChooseSection.style.display).toBe('none');
            expect(ourStorySection.style.display).toBe('none');
        });
    });

    describe('showError', () => {
        test('should log warning to console', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            showError();
            expect(consoleSpy).toHaveBeenCalledWith('Error: Section not found');
            consoleSpy.mockRestore();
        });
    });

    describe('setupNavigation', () => {
        test('should add click event listeners to nav links and navigate correctly', () => {
            const aboutLink = document.querySelector('a[href="#our-story"]');
            const aboutSection = document.getElementById('our-story');
            const homeSection = document.getElementById('home');
            const servicesSection = document.getElementById('why-choose');
            aboutLink.click();
            expect(aboutSection.style.display).toBe('block');
            expect(homeSection.style.display).toBe('none');
            expect(servicesSection.style.display).toBe('none');
        });

        test('should prevent default link behavior', () => {
            const aboutLink = document.querySelector('a[href="#our-story"]');
            const event = new Event('click', { bubbles: true });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
            aboutLink.dispatchEvent(event);
            expect(preventDefaultSpy).toHaveBeenCalled();
            preventDefaultSpy.mockRestore();
        });
    });

    describe('Hamburger Menu Functionality', () => {
        test('should toggle the menu when hamburger is clicked', () => {
            const hamburger = document.getElementById('hamburger');
            const menu = document.getElementById('nav-menu');
            expect(menu.classList.contains('show')).toBe(false);
            hamburger.click();
            expect(menu.classList.contains('show')).toBe(true);
            expect(hamburger.innerHTML).toBe('&times;'); 
            hamburger.click();
            expect(menu.classList.contains('show')).toBe(false);
            expect(hamburger.innerHTML).toBe('&#9776;'); 
        });

        test('should close the menu when clicking outside', () => {
            const hamburger = document.getElementById('hamburger');
            const menu = document.getElementById('nav-menu');
            hamburger.click();
            expect(menu.classList.contains('show')).toBe(true);
            const outsideClick = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            });
            document.dispatchEvent(outsideClick);

            expect(menu.classList.contains('show')).toBe(false);
            expect(hamburger.innerHTML).toBe('&#9776;'); 
        });
    });

    describe('DOMContentLoaded', () => {
        test('should initialize with home section displayed', () => {
            document.documentElement.innerHTML = html;
            const heroSection = document.querySelector('.hero');
            if (heroSection) heroSection.id = 'home';
            document.dispatchEvent(new Event('DOMContentLoaded'));
            const homeSection = document.getElementById('home');
            const whyChooseSection = document.getElementById('why-choose');
            const ourStorySection = document.getElementById('our-story');
            expect(homeSection.style.display).toBe('block');
            expect(whyChooseSection.style.display).toBe('none');
            expect(ourStorySection.style.display).toBe('none');
        });
    });
});
