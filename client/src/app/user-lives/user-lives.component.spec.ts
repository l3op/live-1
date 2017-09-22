import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLivesComponent } from './user-lives.component';

describe('UserLivesComponent', () => {
  let component: UserLivesComponent;
  let fixture: ComponentFixture<UserLivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
