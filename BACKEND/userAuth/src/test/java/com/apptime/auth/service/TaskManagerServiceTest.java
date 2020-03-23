package com.apptime.auth.service;
import com.apptime.auth.config.TaskStateMachine;
import com.apptime.auth.model.FormatedDate;
import com.apptime.auth.model.Task;
import com.apptime.auth.model.TaskState;
import com.apptime.auth.repository.TaskReportRepository;
import com.apptime.auth.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import static com.apptime.auth.model.TaskState.ACTIVE;
import static com.apptime.auth.model.TaskState.COMPLETED;
import static com.apptime.auth.model.TaskState.CREATED;
import static com.apptime.auth.model.TaskState.PAUSED;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * @author Qi Zhang
 * The unit test class for TaskManagerServiceTest
 */
@SpringBootTest
public class TaskManagerServiceTest {
    @Autowired
    private TaskManagerService service;

    @Autowired
    private TaskRepository repository;

    @Autowired
    private TaskReportRepository reportRepository;

    private NotificationService notificationService;

    private TaskReportService reportService;

    @BeforeEach
    public void init() {
        reportRepository.deleteAll();
        repository.deleteAll();
        notificationService = mock(NotificationService.class);
        service.setNotificationService(notificationService);
        reportService = mock(TaskReportService.class);
        service.setReportService(reportService);
        service.setTaskRepo(repository);
    }

    @Test
    public void testCreateTask() {
        Task task = new Task();
        String name = UUID.randomUUID().toString();
        task.setName(name);
        String username = "username";
        Task savedTask = service.createTask(task, username);

        assertEquals(name, savedTask.getName());
        assertEquals(username, savedTask.getUserName());
        assertEquals(TaskState.CREATED, task.getState());

        verify(notificationService, times(1)).createNotificationForTask(any(Task.class));

        Task task2 = new Task();
        String name2 = UUID.randomUUID().toString();
        task2.setName(name2);
        Task savedTask2 = service.createTask(task2, username);
        assertEquals(name2, savedTask2.getName());
        assertEquals(username, savedTask2.getUserName());

        assertNotEquals(savedTask.getId(), savedTask2.getId());

        Task taskInDb1 = service.getTask(savedTask.getId());
        assertNotNull(taskInDb1);
        assertEquals(savedTask.getId(), taskInDb1.getId());
        assertEquals(name, taskInDb1.getName());
        assertEquals(username, taskInDb1.getUserName());

        Task taskInDb2 = service.getTask(savedTask2.getId());
        assertNotNull(taskInDb2);
        assertEquals(savedTask2.getId(), taskInDb2.getId());
        assertEquals(name2, taskInDb2.getName());
        assertEquals(username, taskInDb2.getUserName());
    }

    @Test
    public void testUpdateTask() {
        Task task = new Task();
        String name = UUID.randomUUID().toString();
        task.setName(name);
        String username = "username";
        Task savedTask = service.createTask(task, username);

        String newName = UUID.randomUUID().toString();
        savedTask.setName(newName);
        String desc = UUID.randomUUID().toString();
        assertNotEquals(desc, savedTask.getDescription());
        savedTask.setDescription(desc);
        Task updatedTask = service.updateTask(savedTask, username);
        assertEquals(savedTask.getId(), updatedTask.getId());
        assertEquals(savedTask.getUserName(), updatedTask.getUserName());
        assertNotEquals(name, updatedTask.getName());
        assertEquals(newName, updatedTask.getName());
        assertEquals(desc, updatedTask.getDescription());

        verify(notificationService, times(1)).updateNotificationForTask(any(Task.class));

        // try update with different username
        assertNull(service.updateTask(updatedTask, UUID.randomUUID().toString()));

        repository.deleteAll();
        updatedTask = service.updateTask(savedTask, username);
        assertNull(updatedTask);
    }

    @Test
    public void testDeleteTask() {
        Task task = new Task();
        String name = UUID.randomUUID().toString();
        task.setName(name);
        String username = "username";
        Task savedTask = service.createTask(task, username);

        Task taskInDb = service.getTask(savedTask.getId());
        assertNotNull(taskInDb);
        assertEquals(savedTask.getId(), taskInDb.getId());

        Task deletedTask = service.deleteTask(taskInDb.getId());
        assertNotNull(deletedTask);
        assertEquals(deletedTask.getId(), taskInDb.getId());

        verify(notificationService, times(1)).deleteNotificationForTask(any(Task.class));

        deletedTask = service.deleteTask(taskInDb.getId());
        assertNull(deletedTask);
    }

    @Test
    public void testGetTask() {
        Task task = new Task();
        String name = UUID.randomUUID().toString();
        task.setName(name);
        String username = "username";
        Task savedTask = service.createTask(task, username);

        Task taskInDb = service.getTask(savedTask.getId());
        assertNotNull(taskInDb);
        assertEquals(savedTask.getId(), taskInDb.getId());

        repository.deleteAll();
        taskInDb = service.getTask(savedTask.getId());
        assertNull(taskInDb);
    }

    @Test
    public void testStart() {
        TaskRepository repository = mock(TaskRepository.class);
        service.setTaskRepo(repository);

        when(repository.findById(anyLong())).thenReturn(null);
        TaskState state = service.start(1L);
        assertNull(state);
        verify(repository, never()).save(any(Task.class));

        Task task = new Task();
        when(repository.findById(anyLong())).thenReturn(task);

        task.setState(CREATED);
        state = service.start(1L);
        assertEquals(ACTIVE, state);
        assertEquals(ACTIVE, task.getState());
        assertNotNull(task.getStart());
        verify(repository, times(1)).save(eq(task));
        clearInvocations(repository);

        task.setState(COMPLETED);
        state = service.start(1L);
        assertEquals(COMPLETED, state);
        assertEquals(COMPLETED, task.getState());
        verify(repository, times(1)).save(eq(task));
    }

    @Test
    public void testgetTasksStartedLaterThan() throws ParseException {
        TaskRepository repository = mock(TaskRepository.class);
        service.setTaskRepo(repository);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String sDate="2020-04-22";
        Date start=dateFormat.parse(sDate);
        String name = "userName";
        Task task = new Task();
        Set<Task> tasks = new HashSet<Task>();
        //test empty result
        when(repository.getTasksStartedLaterThan(start,name)).thenReturn(tasks);
        Set<Task> resultSet =  service.getTasksStartedLaterThan(start,name);
        assertEquals(0, resultSet.size());
        tasks.add(task);
        task.setScheduledstart(start);
        when(repository.getTasksStartedLaterThan(start,name)).thenReturn(tasks);
        Task result =  service.getTasksStartedLaterThan(start,name).iterator().next();
        assertEquals(task.getScheduledstart(),result.getScheduledstart() );


    }


    @Test
    public void testPause() {
        TaskRepository repository = mock(TaskRepository.class);
        service.setTaskRepo(repository);

        when(repository.findById(anyLong())).thenReturn(null);
        TaskState state = service.pause(1L);
        assertNull(state);
        verify(repository, never()).save(any(Task.class));

        Task task = new Task();
        when(repository.findById(anyLong())).thenReturn(task);

        task.setState(ACTIVE);
        task.setStart(new Date(System.currentTimeMillis() - 1000L));
        state = service.pause(1L);
        assertEquals(PAUSED, state);
        assertEquals(PAUSED, task.getState());
        assertNotNull(task.getDuration());
        verify(repository, times(1)).save(eq(task));
        clearInvocations(repository);

        task.setState(COMPLETED);
        state = service.pause(1L);
        assertEquals(COMPLETED, state);
        verify(repository, times(1)).save(eq(task));
    }

    @Test
    public void testComplete() {
        TaskRepository repository = mock(TaskRepository.class);
        service.setTaskRepo(repository);

        when(repository.findById(anyLong())).thenReturn(null);
        TaskState state = service.complete(1L);
        assertNull(state);
        verify(repository, never()).save(any(Task.class));

        Task task = new Task();
        when(repository.findById(anyLong())).thenReturn(task);

        task.setState(ACTIVE);
        task.setStart(new Date(System.currentTimeMillis() - 1000L));
        state = service.complete(1L);
        assertEquals(COMPLETED, state);
        assertEquals(COMPLETED, task.getState());
        assertNotNull(task.getDuration());
        assertNotNull(task.getEnd());
        verify(repository, times(1)).save(eq(task));
        verify(reportService, times(1)).generateReport(any());
        clearInvocations(repository, reportService);

        task.setState(CREATED);
        state = service.complete(1L);
        assertEquals(CREATED, state);
        verify(repository, times(1)).save(eq(task));
        verify(reportService, times(1)).generateReport(any());
    }
}
