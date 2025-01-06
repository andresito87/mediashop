import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FooterComponent', () => {
  beforeEach(waitForAsync(() => {
    // Simula la función HOMEINIT

    TestBed.configureTestingModule({
      imports: [FooterComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render footer', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('footer')).toBeTruthy();
  });

  it('should render footer text', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('.tp-footer-copyright')?.textContent
    ).toContain('© 2025 All Rights Reserved | Mediashop');
  });

  it('should render footer text', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const emailLink = compiled.querySelector('.tp-footer-contact-content a');
    expect(emailLink?.textContent).toContain('tienda.andrescoder.dev');
  });
});
