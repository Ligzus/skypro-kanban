import React, { useState } from 'react';
import Calendar from '../../Calendar/Calendar';
import { Link, useNavigate } from 'react-router-dom';
import {
  PopBrowseWrapper,
  PopBrowseContainer,
  PopBrowseBlock,
  PopBrowseContent,
  PopBrowseTopBlock,
  PopBrowseTitle,
  CategoriesThemeTop,
  Status,
  StatusText,
  StatusThemes,
  StatusTheme,
  StatusThemeText,
  PopBrowseWrap,
  FormBrowse,
  FormBrowseBlock,
  TextArea,
  CalendarWrapper,
  CalendarTitle,
  PopBrowseBtnBrowse,
  BtnBrowseEdit,
  BtnBrowseDelete,
  BtnBrowseClose,
  Descrbtion,
  BtnGroup,
  BtnBrowseCancel,
  BtnBrowseDel,
  BtnBrowseSave
} from './PopBrowse.styled';
import { useTasks } from '../../../hooks/useTasks';
import { format } from 'date-fns';
import { deleteTodo } from '../../../api';
import { useUser } from '../../../hooks/useUser';

const PopBrowse = ({ id }) => {
  const { tasks } = useTasks();
  const task = tasks.find(task => task._id === id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(task?.status || "Без статуса");
  let navigate = useNavigate();
  const { user } = useUser();
  const { setTasks } = useTasks();

  if (!task) {
    return;
  }

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setCurrentStatus(task.status); 
  };

  const handleStatusClick = (status) => {
    setCurrentStatus(status);
  };

  const handleDeleteClick = async () => {
    try {
        const updatedTasks = await deleteTodo({
        id: task._id,
        user
      });
      setTasks(updatedTasks.tasks);
      navigate('/'); 
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
      
    }
  };

  return (
    <PopBrowseWrapper id="popBrowse">
      <PopBrowseContainer>
        <PopBrowseBlock>
          <PopBrowseContent>
            <PopBrowseTopBlock>
              <PopBrowseTitle>{task.title}</PopBrowseTitle>
              <CategoriesThemeTop
                className={`
                ${task.topic === 'Research' ? '_green' : ''}
                ${task.topic === 'Web Design' ? '_orange' : ''}
                ${task.topic === 'Copywriting' ? '_purple' : ''}
                ${task.topic === 'Без категории' ? '_gray' : ''}
              `}
              >
                <p>{task.topic}</p>
              </CategoriesThemeTop>
            </PopBrowseTopBlock>
            <Status>
              <StatusText className="subttl">Статус</StatusText>
              <StatusThemes>
                {isEditMode ? (
                  ["Без статуса", "Нужно сделать", "В работе", "Тестирование", "Готово"].map((status) => (
                    <StatusTheme
                      key={status}
                      className={currentStatus === status ? "_gray" : ""}
                      onClick={() => handleStatusClick(status)}
                    >
                      <StatusThemeText>{status}</StatusThemeText>
                    </StatusTheme>
                  ))
                ) : (
                  <StatusTheme className="_gray">
                    <StatusThemeText>{currentStatus}</StatusThemeText>
                  </StatusTheme>
                )}
              </StatusThemes>
            </Status>
            <PopBrowseWrap>
              <FormBrowse id="formBrowseCard" action="#">
                <FormBrowseBlock>
                  <Descrbtion htmlFor="textArea01">Описание задачи</Descrbtion>
                  <TextArea
                    name="text"
                    id="textArea01"
                    readOnly={!isEditMode}
                    value={task.description}
                    onChange={() => {}}
                  ></TextArea>
                </FormBrowseBlock>
              </FormBrowse>
              <CalendarWrapper>
                <CalendarTitle>Даты</CalendarTitle>
                <Calendar date={task.date} setSelected={() => {}} readOnly={!isEditMode} />
                <p>Срок исполнения: <span>{format(new Date(task.date), 'dd.MM.yyyy')}</span></p>
              </CalendarWrapper>
            </PopBrowseWrap>

            <PopBrowseBtnBrowse>
              <BtnGroup>
                {isEditMode ? (
                  <div className='editButtons'>
                    <BtnBrowseSave className="_btn-bg _hover01">Сохранить</BtnBrowseSave>
                    <BtnBrowseCancel className="_btn-bor _hover03" onClick={handleCancelClick}>Отменить</BtnBrowseCancel>
                    <BtnBrowseDel className="_btn-bor _hover03" onClick={handleDeleteClick}>Удалить задачу</BtnBrowseDel>
                  </div>
                ) : (
                  <div className='mainButtons'>
                    <BtnBrowseEdit className="_btn-bor _hover03" onClick={handleEditClick}>Редактировать</BtnBrowseEdit>
                    <BtnBrowseDelete className="_btn-bg _hover01" onClick={handleDeleteClick}>Удалить</BtnBrowseDelete>
                  </div>
                )}
              </BtnGroup>
              <BtnBrowseClose className="_btn-bor _hover03">
                <Link to="/">Закрыть</Link>
              </BtnBrowseClose>
            </PopBrowseBtnBrowse>
          </PopBrowseContent>
        </PopBrowseBlock>
      </PopBrowseContainer>
    </PopBrowseWrapper>
  );
};

export default PopBrowse;