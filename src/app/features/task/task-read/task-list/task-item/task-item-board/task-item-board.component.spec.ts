import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { TaskPriority } from '../../../../../../core/types/enums/task/task-priority';
import { TaskStatus } from '../../../../../../core/types/enums/task/task-status';
import { Task } from '../../../../../../core/types/interfaces/task';
import * as TaskActions from '../../../../../../shared/_store/task/task.actions';
import { TaskState } from '../../../../../../shared/_store/task/task.state';
import { TaskItemBoardComponent } from './task-item-board.component';

describe('TaskItemBoardComponent', () => {
  let component: TaskItemBoardComponent;
  let fixture: ComponentFixture<TaskItemBoardComponent>;
  let mockStore: jasmine.SpyObj<Store<TaskState>>;

  const mockTasks: Task[] = [
    {
      id: 'tufmwtr',
      title: 'Fix Django REST Serializers',
      description: 'Lorem ipsum dolor sit amet...',
      status: TaskStatus.Doing,
      priority: TaskPriority.Low,
      createdDate: new Date('2024-07-24'),
      updatedDate: new Date('2024-07-24'),
      dueDate: new Date('2024-07-25'),
      assignedTo: ['gerald_nika'],
      comments: [],
      attachment: 'Firebase Auth Documentation Requirements.docx',
      user_id: '_0e8jjql',
      username: 'gerald_nika',
    },
    {
      id: '51ve60i',
      title: 'Add Laravel Providers',
      description: 'Lorem ipsum dolor sit amet...',
      status: TaskStatus.Reviewing,
      priority: TaskPriority.Medium,
      createdDate: new Date('2024-07-24'),
      updatedDate: new Date('2024-07-24'),
      dueDate: new Date('2024-08-10'),
      assignedTo: ['gerardo_tatzati', 'andi_nika'],
      comments: [],
      attachment: 'Firebase Auth Documentation Requirements.docx',
      user_id: '_0e8jjql',
      username: 'gerald_nika',
    },
  ];

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    await TestBed.configureTestingModule({
      declarations: [TaskItemBoardComponent],
      imports: [DragDropModule, StoreModule.forRoot({})],
      providers: [{ provide: Store, useValue: mockStore }],
    }).compileComponents();

    mockStore.select.and.returnValue(of(mockTasks));

    fixture = TestBed.createComponent(TaskItemBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct header class', () => {
    expect(component.getHeaderClass('Pending')).toBe('bg-warning text-black');
    expect(component.getHeaderClass('Doing')).toBe('bg-primary text-white');
    expect(component.getHeaderClass('Reviewing')).toBe('bg-brown text-white');
    expect(component.getHeaderClass('Completed')).toBe('bg-success text-white');
    expect(component.getHeaderClass('Unknown')).toBe('');
  });

  it('should emit openTask event', () => {
    spyOn(component.openTask, 'emit');
    component.onOpenTask('tufmwtr');
    expect(component.openTask.emit).toHaveBeenCalledWith('tufmwtr');
  });

  it('should handle drop event between different containers', () => {
    const mockEvent = {
      previousContainer: { data: [mockTasks[0]] },
      container: { data: [mockTasks[1]] },
      previousIndex: 0,
      currentIndex: 0,
    } as CdkDragDrop<Task[]>;

    spyOn(component, 'loadTasks');
    spyOn(component as any, 'updateTaskStatus');
    component.drop(mockEvent, TaskStatus.Reviewing);
    expect(component.loadTasks).toHaveBeenCalled();
    expect((component as any).updateTaskStatus).toHaveBeenCalledWith(
      mockTasks[0],
      TaskStatus.Reviewing
    );
  });

  it('should update task status', () => {
    const task = mockTasks[0];
    const newStatus = TaskStatus.Completed;
    (component as any).updateTaskStatus(task, newStatus);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      TaskActions.updateTask({
        task: { ...task, status: newStatus },
      })
    );
  });
});
