import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSearchedComponent } from './profile-searched.component';

describe('ProfileSearchedComponent', () => {
  let component: ProfileSearchedComponent;
  let fixture: ComponentFixture<ProfileSearchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileSearchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSearchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
