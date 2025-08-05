
    document.addEventListener('DOMContentLoaded', function() {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const taskList = document.getElementById('taskList');
      
      savedTasks.forEach(task => {
        addTaskToList(task.text, task.completed);
      });

      function updateEmptyState() {
        if (taskList.children.length === 0) {
          const emptyMsg = document.createElement('div');
          emptyMsg.className = 'empty-state';
          emptyMsg.textContent = 'Your to-do list is empty. Add some tasks!';
          taskList.appendChild(emptyMsg);
        } else {
          const emptyMsg = taskList.querySelector('.empty-state');
          if (emptyMsg) {
            emptyMsg.remove();
          }
        }
      }

      updateEmptyState();

      function addTaskToList(taskText, isCompleted = false) {
        if (taskList.querySelector('.empty-state')) {
          taskList.querySelector('.empty-state').remove();
        }

        const li = document.createElement('li');
        if (isCompleted) {
          li.classList.add('completed');
        }

        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = taskText;
        li.appendChild(taskSpan);

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'task-controls';

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          const newTask = prompt('Edit your task:', taskSpan.textContent);
          if (newTask !== null && newTask.trim() !== '') {
            taskSpan.textContent = newTask.trim();
            saveTasks();
          }
        });

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          if (confirm('Are you sure you want to remove this task?')) {
            li.remove();
            saveTasks();
            updateEmptyState();
          }
        });

        controlsDiv.appendChild(editBtn);
        controlsDiv.appendChild(removeBtn);
        li.appendChild(controlsDiv);

        // Mark completed on click
        li.addEventListener('click', function(e) {
          if (e.target === taskSpan || e.target === li) {
            li.classList.toggle('completed');
            saveTasks();
          }
        });

        taskList.appendChild(li);
      }

      function saveTasks() {
        const tasks = [];
        Array.from(taskList.children).forEach(li => {
          if (li.className !== 'empty-state') {
            tasks.push({
              text: li.querySelector('.task-text').textContent,
              completed: li.classList.contains('completed')
            });
          }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }

      document.getElementById('addTaskBtn').addEventListener('click', function() {
        const input = document.getElementById('taskInput');
        const taskText = input.value.trim();
        if (taskText) {
          addTaskToList(taskText);
          input.value = '';
          saveTasks();
          input.focus();
        }
      });

      // Allow adding tasks with Enter key
      document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          document.getElementById('addTaskBtn').click();
        }
      });
    });
