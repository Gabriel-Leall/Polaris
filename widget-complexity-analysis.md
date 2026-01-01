# Widget Complexity Analysis

## Analysis Results

Based on the folder organization criteria (widgets over 150 lines need folder organization), here are the findings:

### Widgets Requiring Folder Organization (>150 lines)

1. **JobTrackerWidget.tsx** - 589 lines
   - **Status**: Needs folder organization
   - **Complexity**: Very High
   - **Components to extract**: 
     - JobApplicationForm (create/edit dialog)
     - JobApplicationCard (individual application display)
     - StatusSelector (status dropdown)
     - FilterDropdown (status filter)
   - **Hooks to extract**:
     - useJobApplications (CRUD operations)
     - useJobApplicationForm (form state management)
   - **Utils to extract**:
     - jobApplicationUtils (date formatting, status colors)
   - **Types**: JobApplicationFormData, status mappings

2. **TasksWidget.tsx** - 493 lines
   - **Status**: Needs folder organization
   - **Complexity**: High
   - **Components to extract**:
     - TaskItem (individual task display with edit functionality)
     - TaskForm (add new task input)
     - TaskStats (completion statistics)
   - **Hooks to extract**:
     - useTasks (CRUD operations, local/remote sync)
     - useTaskEdit (inline editing logic)
   - **Utils to extract**:
     - taskUtils (local storage, mockup data)

3. **CalendarWidget.tsx** - 467 lines
   - **Status**: Needs folder organization
   - **Complexity**: High
   - **Components to extract**:
     - TaskModal (large modal component)
     - CalendarGrid (calendar display logic)
     - DayCell (individual day component)
   - **Hooks to extract**:
     - useCalendarTasks (task management per day)
     - useCalendarNavigation (month navigation)
   - **Utils to extract**:
     - calendarUtils (date calculations, formatting)

4. **BrainDumpWidget.tsx** - 450 lines
   - **Status**: Already has some organization but needs folder structure
   - **Complexity**: High
   - **Components to extract**:
     - EditorToolbar (already defined as component)
     - SaveIndicator (already defined as component)
     - ToolbarButton (already defined as component)
   - **Hooks to extract**:
     - useBrainDumpEditor (editor initialization and management)
     - useBrainDumpSync (auto-save logic)
   - **Utils to extract**:
     - editorConfig (TipTap configuration)

5. **HabitTrackerWidget.tsx** - 411 lines
   - **Status**: Needs folder organization
   - **Complexity**: High
   - **Components to extract**:
     - HabitRow (individual habit display)
     - DayCircle (completion indicator)
     - HabitForm (add new habit)
   - **Hooks to extract**:
     - useHabits (CRUD operations)
     - useHabitTracking (day toggle logic)
   - **Utils to extract**:
     - habitUtils (completion calculations, default habits)

6. **MediaPlayerWidget.tsx** - 407 lines
   - **Status**: Needs folder organization
   - **Complexity**: High
   - **Components to extract**:
     - PlayerControls (play/pause/skip buttons)
     - TrackInfo (current track display)
     - UrlForm (input form for media URLs)
   - **Hooks to extract**:
     - useMediaPlayer (playback state management)
     - useMediaUrl (URL validation and processing)
   - **Utils to extract**:
     - mediaUtils (already exists in lib, but widget-specific utils needed)

### Widgets Staying as Single Files (<150 lines)

7. **ZenTimerWidget.tsx** - 265 lines
   - **Status**: Keep as single file
   - **Reason**: While over 150 lines, it's well-organized and doesn't have complex sub-components that warrant extraction
   - **Complexity**: Medium - mostly self-contained timer logic

## Summary

- **6 widgets** need folder organization (JobTracker, Tasks, Calendar, BrainDump, HabitTracker, MediaPlayer)
- **1 widget** stays as single file (ZenTimer)
- **BrainDumpWidget** already has some component extraction but needs proper folder structure
- **QuickLinksWidget** already completed in previous tasks

## Reorganization Priority

1. **JobTrackerWidget** (589 lines) - Highest priority
2. **TasksWidget** (493 lines) - High priority  
3. **CalendarWidget** (467 lines) - High priority
4. **BrainDumpWidget** (450 lines) - Medium priority (partially organized)
5. **HabitTrackerWidget** (411 lines) - Medium priority
6. **MediaPlayerWidget** (407 lines) - Medium priority