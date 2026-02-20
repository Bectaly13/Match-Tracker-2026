import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KnockoutsPage } from './knockouts.page';

describe('KnockoutsPage', () => {
  let component: KnockoutsPage;
  let fixture: ComponentFixture<KnockoutsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KnockoutsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
