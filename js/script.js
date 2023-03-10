!(() => {
	function createContainer() {
		const section = document.createElement('seciton');
		const container = document.createElement('div');

		section.classList.add('clients');
		container.classList.add('container', 'clients__container');
		section.id = 'clients';

		section.append(container);

		return container;
	}

	function createTableWrapper() {
		const wrapper = document.createElement('div');
		wrapper.classList.add('clients__table');
		return wrapper;
	}

	function createTable() {
		const table = document.createElement('table');
		const tableTitle = document.createElement('caption');

		table.classList.add('clients-table');
		tableTitle.classList.add('clients-table__title', 'title');

		tableTitle.textContent = 'Клиенты';

		table.append(tableTitle);

		return table;
	}

	function createTableHead() {
		function renderSortedIcon(node) {
			const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const pathSvg = document.createElementNS("http://www.w3.org/2000/svg", 'path');
			
			iconSvg.classList.add('clients-table__ico');
			if (node !== idCellButton) {
				iconSvg.classList.add('rotate');
			}
			iconSvg.setAttribute('width', '8');
			iconSvg.setAttribute('height', '8');
			iconSvg.setAttribute('viewBox', '0 0 8 8');
			iconSvg.setAttribute('fill', 'none')

			pathSvg.setAttribute('d', "M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z");
			pathSvg.setAttribute('fill', 'currentColor');

			iconSvg.appendChild(pathSvg);

			return node.appendChild(iconSvg);
		}

		const tableHead = document.createElement('thead');
		const tableRow = document.createElement('tr');

		const idCell = document.createElement('th'); 
		const idCellButton = document.createElement('button');
		const idCellCaption = document.createElement('span');
		
		const fullNameCell = document.createElement('th');
		const fullNameCellButton = document.createElement('button');
		const fullNameCellCaption = document.createElement('span');
		const fullNameCellCaptionSort = document.createElement('span');
		
		const creationDateCell = document.createElement('th');
		const creationDateCellButton = document.createElement('button');
		const creationDateCellCaption = document.createElement('span');

		const latestChangeCell = document.createElement('th'); 
		const latestChangeCellButton = document.createElement('button');
		const latestChangeCellCaption = document.createElement('span');

		const contactsCell = document.createElement('th'); 
		const contactsCellCaption = document.createElement('span');

		const actionCell = document.createElement('th'); 
		const actionCellCaption = document.createElement('span');

		const cells = [idCell, fullNameCell, creationDateCell, latestChangeCell, contactsCell, actionCell];
		const buttons = [idCellButton, fullNameCellButton, creationDateCellButton, latestChangeCellButton];
		const captions = [idCellCaption, fullNameCellCaption, creationDateCellCaption, latestChangeCellCaption, contactsCellCaption, actionCellCaption];

		buttons.forEach(btn => {
			btn.setAttribute('data-control', 'button');
		})

		tableHead.classList.add('clients-table__head-wrapper');
		tableRow.classList.add('clients-table__head');
		adjustClasses(cells, 'clients-table__data', 'clients-table__data--head');
		adjustClasses(buttons, 'clients-table__btn', 'btn-reset');
		adjustClasses(captions, 'clients-table__text', 'subtitle');
		idCellCaption.classList.add('active-sort');
		fullNameCellCaptionSort.classList.add('clients-table__sort-help');
		
		idCellButton.setAttribute('data-sortby', 'id');
		idCellButton.setAttribute('data-sortorder', 'increased');
		fullNameCellButton.setAttribute('data-sortby', 'fullname');
		fullNameCellButton.setAttribute('data-sortorder', 'decreased');
		creationDateCellButton.setAttribute('data-sortby', 'createdAt');
		creationDateCellButton.setAttribute('data-sortorder', 'decreased');
		latestChangeCellButton.setAttribute('data-sortby', 'updatedAt');
		latestChangeCellButton.setAttribute('data-sortorder', 'decreased');
		
		idCellCaption.textContent = 'ID';
		fullNameCellCaption.textContent = 'Фамилия Имя Отчество';
		fullNameCellCaptionSort.innerHTML = 'Я&#8209;А'
		creationDateCellCaption.textContent = 'Дата и время создания';
		latestChangeCellCaption.textContent = 'Последние изменения';
		contactsCellCaption.textContent = 'Контакты';
		actionCellCaption.textContent = 'Действия';

		idCell.append(idCellButton);
		idCellButton.append(idCellCaption);
		renderSortedIcon(idCellButton);
		
		fullNameCell.append(fullNameCellButton);
		fullNameCellButton.append(fullNameCellCaption);
		renderSortedIcon(fullNameCellButton);
		fullNameCellButton.append(fullNameCellCaptionSort);

		creationDateCell.append(creationDateCellButton);
		creationDateCellButton.append(creationDateCellCaption);
		renderSortedIcon(creationDateCellButton);

		latestChangeCell.append(latestChangeCellButton);
		latestChangeCellButton.append(latestChangeCellCaption);
		renderSortedIcon(latestChangeCellButton);

		contactsCell.append(contactsCellCaption);

		actionCell.append(actionCellCaption);

		appendElements(cells, tableRow);
		tableHead.append(tableRow);

		return {
			tableHead,
			buttons
		}
	}

	function createTableBody() {
		const body = document.createElement('tbody');
		const loadingRow = document.createElement('tr');
		const loadingCell = document.createElement('td');
		const loadingElement = document.createElement('div');
		const loadingIcon = createLoadingSpinner(80, 80);
		
		loadingElement.classList.add('table-spinner-preload');
		loadingCell.classList.add('clients-table__data', 'clients-table__data--preload')
		loadingRow.classList.add('clients-table__body');
		body.classList.add('clients-table__body-wrapper');

		loadingCell.setAttribute('colspan', '6');

		loadingElement.append(loadingIcon);
		loadingCell.append(loadingElement);
		loadingRow.append(loadingCell);
		body.append(loadingRow);

		return {
			body,
			loadingRow,
		}
	}

	function createClientRow(clientData, eventHandlers) {
		function formatFullName(surname, name, lastName) {
			let fullname = [surname, name, lastName]
			.filter(str => str.trim().length > 0)
			.map(item => {
				return item[0].toUpperCase() + item.slice(1).toLowerCase();
			})
			.join(' ')

			return fullname;
		}

		function formatDate(date) {
			const day = new Date(date).getDate() > 9 ? new Date(date).getDate() : 0 + `${new Date(date).getDate()}`;
			const month = new Date(date).getMonth() + 1 > 9 ? new Date(date).getMonth() + 1 : 0 + `${new Date(date).getMonth() + 1}`;
			const year = new Date(date).getFullYear();
			const formattedDate = `${day}.${month}.${year}`;

			return formattedDate;
		}

		function formatTime(time) {
			const hours = new Date(time).getHours() > 9 ? new Date(time).getHours() : 0 + `${new Date(time).getHours()}`;
			const minutes = new Date(time).getMinutes() > 9 ? new Date(time).getMinutes() : 0 + `${new Date(time).getMinutes()}`;
			const formattedTime = `${hours}:${minutes}`;

			return formattedTime;
		}

		function createControlButtonSvg(wProp, hProp, dProperty, fillProperty) {
			const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			
			svgIcon.classList.add('clients-table-icon');
			
			svgIcon.setAttribute('width', wProp);
			svgIcon.setAttribute('height', hProp);
			svgIcon.setAttribute('viewBox', `0 0 ${wProp} ${hProp}`);
			svgIcon.setAttribute('fill', 'none');

			svgPath.setAttribute('d', dProperty);
			svgPath.setAttribute('fill', fillProperty);
			
			svgIcon.appendChild(svgPath);
			
			return svgIcon;
		}

		const tableRow = document.createElement('tr');

		const idTableCell = document.createElement('td');

		const fullNameCell = document.createElement('td');

		const creationCell = document.createElement('td');
		const creationCellWrapper = document.createElement('div');
		const creationCellDate = document.createElement('span');
		const creationCellTime = document.createElement('span');

		const latestCell = document.createElement('td');
		const latestCellWrapper = document.createElement('div');
		const latestCellDate = document.createElement('span');
		const latestCellTime = document.createElement('span');

		const contactCell = document.createElement('td');

		const actionCell = document.createElement('td');
		const actionCellButtonWrapper = document.createElement('div');
		const changeClientInfoButton = document.createElement('button');
		const changeClientIcon = createControlButtonSvg('13', '13', "M0 10.5V13H2.5L9.87333 5.62662L7.37333 3.12662L0 10.5ZM11.8067 3.69329C12.0667 3.43329 12.0667 3.01329 11.8067 2.75329L10.2467 1.19329C9.98667 0.933291 9.56667 0.933291 9.30667 1.19329L8.08667 2.41329L10.5867 4.91329L11.8067 3.69329Z", "#9873FF");
		const changeButtonText = document.createElement('span');
		const deleteClientButton = document.createElement('button');
		const deleteClientIcon = createControlButtonSvg('12', '12', "M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z", "#F06A4D");
		const deleteButtonText = document.createElement('span');

		const cells = [idTableCell, fullNameCell, creationCell, latestCell, contactCell, actionCell];
		let {onChange} = eventHandlers;
		
		adjustClasses(cells, 'clients-table__data');

		idTableCell.classList.add('clients-table__body-id', 'subtitle');

		fullNameCell.classList.add('clients-table__body-fullname', 'text');

		creationCellWrapper.classList.add('clients-table__date-wrapper');
		latestCellWrapper.classList.add('clients-table__date-wrapper');

		creationCellDate.classList.add('clients-table__date', 'text');
		creationCellTime.classList.add('clients-table__time', 'subtitle');

		latestCellDate.classList.add('clients-table__date', 'text');
		latestCellTime.classList.add('clients-table__time', 'subtitle');

		actionCellButtonWrapper.classList.add('clients-table__change');
		changeClientInfoButton.classList.add('clients-table__edit', 'btn-reset');
		changeButtonText.classList.add('clients-table__edit-text', 'text');
		deleteClientButton.classList.add('clients-table__delete', 'btn-reset');
		deleteButtonText.classList.add('clients-table__edit-text', 'text');

		tableRow.classList.add('clients-table__body');

		changeClientInfoButton.setAttribute('data-control', 'button');
		deleteClientButton.setAttribute('data-control', 'button');

		idTableCell.textContent = clientData.id;
		fullNameCell.textContent = formatFullName(clientData.surname, clientData.name, clientData.lastName);
		creationCellDate.textContent = formatDate(clientData.createdAt);
		creationCellTime.textContent = formatTime(clientData.createdAt);
		latestCellDate.textContent = formatDate(clientData.updatedAt);
		latestCellTime.textContent = formatTime(clientData.updatedAt);;
		changeButtonText.textContent = 'Изменить';
		deleteButtonText.textContent = 'Удалить';

		changeClientInfoButton.addEventListener('click', async () => {
			const loadingIcon = createLoadingSpinner(12, 12);

			changeClientIcon.classList.add('hidden');

			document.querySelectorAll('[data-control]').forEach(button => {
				button.setAttribute('disabled', 'disabled');
			})

			changeClientInfoButton.prepend(loadingIcon);
			
			await onChange({clientId: clientData.id, clientRow: tableRow});
			loadingIcon.remove();
			changeClientIcon.classList.remove('hidden');
			
			document.querySelectorAll('[data-control]').forEach(button => {
				button.removeAttribute('disabled');
			})
		})

		deleteClientButton.addEventListener('click', function() {
			const modal = renderModalWindow({modalWindowFunc: createConfirmationWindow, clientData, clientRow: tableRow, eventHandlers});
			document.body.append(modal);
			focusTrap(modal);
			modal.classList.add('modal--active');
		})
		
		creationCellWrapper.append(creationCellDate);
		creationCellWrapper.append(creationCellTime);
		creationCell.append(creationCellWrapper);

		latestCellWrapper.append(latestCellDate);
		latestCellWrapper.append(latestCellTime);
		latestCell.append(latestCellWrapper);
		createContactList(contactCell, clientData.contacts);

		changeClientInfoButton.append(changeClientIcon);
		changeClientInfoButton.append(changeButtonText);
		deleteClientButton.append(deleteClientIcon);
		deleteClientButton.append(deleteButtonText);
		actionCellButtonWrapper.append(changeClientInfoButton);
		actionCellButtonWrapper.append(deleteClientButton)
		actionCell.append(actionCellButtonWrapper);

		appendElements(cells, tableRow);

		return tableRow;
	}

	function createContactIcon({type = 'more', length}) {
			switch (type) {
				case 'vk': {
					const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

					svgIcon.classList.add('contacts-list__link-icon');
					
					svgIcon.setAttribute('width', '16');
					svgIcon.setAttribute('height', '16');
					svgIcon.setAttribute('viewBox', '0 0 16 16');
					svgIcon.setAttribute('fill', 'none');

					svgPath.setAttribute('d', "M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97312 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3196 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z");
					svgPath.setAttribute('fill', '#9873FF');
					
					svgIcon.appendChild(svgPath);
					
					return svgIcon;
				}
				case 'fb': {
					const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

					svgIcon.classList.add('contacts-list__link-icon');
					
					svgIcon.setAttribute('width', '16');
					svgIcon.setAttribute('height', '16');
					svgIcon.setAttribute('viewBox', '0 0 16 16');
					svgIcon.setAttribute('fill', 'none');

					svgPath.setAttribute('d', "M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z");
					svgPath.setAttribute('fill', '#9873FF');
					
					svgIcon.appendChild(svgPath);
					
					return svgIcon;
				}
				case 'phone': {
					const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					const svgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
					const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

					svgIcon.classList.add('contacts-list__link-icon');

					svgIcon.setAttribute('width', '16');
					svgIcon.setAttribute('height', '16');
					svgIcon.setAttribute('viewBox', '0 0 16 16');
					svgIcon.setAttribute('fill', 'none');

					svgCircle.setAttribute('cx', '8');
					svgCircle.setAttribute('cy', '8');
					svgCircle.setAttribute('r', '8');
					svgCircle.setAttribute('fill', '#9873FF');

					svgPath.setAttribute('d', "M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z");
					svgPath.setAttribute('fill', 'white');
					
					svgIcon.appendChild(svgCircle);
					svgIcon.appendChild(svgPath);
					
					return svgIcon;
				}
				case 'mail': {
					const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

					svgIcon.classList.add('contacts-list__link-icon');

					svgIcon.setAttribute('width', '16');
					svgIcon.setAttribute('height', '16');
					svgIcon.setAttribute('viewBox', '0 0 16 16');
					svgIcon.setAttribute('fill', 'none');

					svgPath.setAttribute('fill-rule', 'evenodd');
					svgPath.setAttribute('clip-rule', 'evenodd');
					svgPath.setAttribute('d', 'M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z');
					svgPath.setAttribute('fill', '#9873FF');

					svgIcon.appendChild(svgPath);

					return svgIcon;
				}
				case 'other': {
					const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

					svgIcon.classList.add('contacts-list__link-icon');

					svgIcon.setAttribute('width', '16');
					svgIcon.setAttribute('height', '16');
					svgIcon.setAttribute('viewBox', '0 0 16 16');
					svgIcon.setAttribute('fill', 'none');

					svgPath.setAttribute('fill-rule', 'evenodd');
					svgPath.setAttribute('clip-rule', 'evenodd');
					svgPath.setAttribute('d', 'M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z');
					svgPath.setAttribute('fill', '#9873FF');

					svgIcon.appendChild(svgPath);

					return svgIcon;
				}
				case 'more': {
					const button = document.createElement('button');
					button.classList.add('contacts-list__btn', 'btn-reset');
					button.textContent = `+${length-(length-(length-4))}`;
					
					return button;
				}
			}
	}

	function createContactList(node, contactsArray) {
		const list = document.createElement('ul');
		list.classList.add('clients-table__list', 'contacts-list', 'list-reset');

		for (const contact of contactsArray) {
			const item = document.createElement('li');
			const link = document.createElement('a');
			const contactType = {
				phone: 'Телефон',
				mail: 'Email',
				fb: 'Facebook',
				vk: 'VK',
				other: 'Другое',
			}
			let {type, value} = contact;

			link.classList.add('contacts-list__link');
			item.classList.add('contacts-list__item');

			tippy(link, {
				content: `${contactType[type]}: ${value}`,
			});

			if (list.childElementCount > 3) {
				item.style = 'display: none';
			}

			if (list.childElementCount > 3 && !list.querySelector('.contacts-list__btn')) {
				const item = document.createElement('li');
				const button = createContactIcon({length: contactsArray.length})
				item.classList.add('contacts-list__item');

				button.addEventListener('click', () => {
					item.style = 'display: none';
					list.childNodes.forEach(item => {
						if (list.childNodes.length > 6) {
							item.style.marginBottom = '8px';
						}
						if (item.style.display === 'none' && !item.querySelector('.contacts-list__btn')) {
							item.style.marginBottom = '0px';
							item.style = 'display: flex';
							if (list.childNodes[5] === item && list.childNodes.length > 6)  item.style.marginBottom = '8px'
					}
					})
				})

				item.appendChild(button);
				list.appendChild(item);
			}

			link.appendChild(createContactIcon({type, length: contactsArray.length}));
			item.appendChild(link);
			list.appendChild(item);
		}

		return node.appendChild(list);
	}

	function createModalWrapper() {
		const wrapper = document.createElement('div');
		wrapper.classList.add('modal');
		return wrapper;
	}

	function createModalWindow({background, clientData = {}, clientRow}, {onSave, onDelete, onClose}) {
		const modal = document.createElement('div');

		const modalTitle = document.createElement('h2');
		const formHeadWrapper = document.createElement('div');
		const form = document.createElement('form');

		const labelSurname = document.createElement('label');
		const titleSurname = document.createElement('span');
		const inputSurname = document.createElement('input');

		const labelName = document.createElement('label');
		const titleName = document.createElement('span');
		const inputName = document.createElement('input');

		const labelSecondName = document.createElement('label');
		const titleSecondName = document.createElement('span');
		const inputSecondName = document.createElement('input');

		const submitBtnWrapper = document.createElement('div');
		const submitBtn = document.createElement('button');
		const cancelBtnWrapper = document.createElement('div');
		const cancelBtn = document.createElement('button');
		const deleteBtnWrapper = document.createElement('div');
		const deleteBtn = document.createElement('button');

		const closeModalBtn = document.createElement('button');
		const closeModalBtnLineFirst = document.createElement('span');
		const closeModalBtnLineSecond = document.createElement('span');

		const inputFields = [
			{label: titleSurname, input: inputSurname},
			{label: titleName, input: inputName}, 
			{label: titleSecondName, input: inputSecondName
		}];

		const contactSection = createContactsSection(clientData.contacts);

		cancelBtn.type = 'button';
		deleteBtn.type = 'button';
	
		modal.classList.add('modal-wrapper');
		modalTitle.classList.add('title', 'clients-form__title');
		closeModalBtn.classList.add('modal-wrapper__close', 'btn-reset');

		form.classList.add('client-form');
		formHeadWrapper.classList.add('clients-form__header');

		labelSurname.classList.add('clients-form__label');
		labelName.classList.add('clients-form__label');
		labelSecondName.classList.add('clients-form__label');

		titleSecondName.classList.add('clients-form__subtitle', 'text');
		titleName.classList.add('clients-form__subtitle', 'clients-form__subtitle--name', 'text');
		titleSurname.classList.add('clients-form__subtitle', 'clients-form__subtitle--surname', 'text');
		
		inputSurname.classList.add('clients-form__input');
		inputName.classList.add('clients-form__input');
		inputSecondName.classList.add('clients-form__input');

		submitBtnWrapper.classList.add('clients-form__btn-wrapper', 'form-btn');
		cancelBtnWrapper.classList.add('clients-form__btn-wrapper', 'form-btn');
		deleteBtnWrapper.classList.add('clients-form__btn-wrapper', 'form-btn');
		submitBtn.classList.add('clients-submit-btn', 'text', 'btn-reset');
		cancelBtn.classList.add('clients-delete-btn', 'btn-reset');
		deleteBtn.classList.add('clients-delete-btn', 'btn-reset');

		modalTitle.setAttribute('data-content', '');
		labelName.setAttribute('data-field', 'required');
		labelSurname.setAttribute('data-field', 'required');

		modalTitle.textContent = clientData.id ? 'Изменить данные' : 'Новый клиент';
		titleSurname.textContent = 'Фамилия';
		titleName.textContent = 'Имя';
		titleSecondName.textContent = 'Отчество';
		submitBtn.textContent = 'Сохранить';
		cancelBtn.textContent = 'Отмена'
		deleteBtn.textContent = 'Удалить клиента';

		if (clientData.id) {
			inputSurname.value = clientData.surname;
			inputName.value = clientData.name;
			inputSecondName.value = clientData.lastName;

			modalTitle.dataset.content = `ID: ${clientData.id}`;

			inputFields.forEach(field => {
				if (field.input.value) {
					animateElement([
						{transform: 'translateY(10px)', fontSize: '1em'},
						{transform: 'translateY(6px)', fontSize: '.92em'},
						{transform: 'translateY(3px)', fontSize: '.84em'},
						{transform: 'translateY(0px)', fontSize: '.76em'},
					], field.label, 'normal', 80);
				}
			})
		}

		closeModalBtn.addEventListener('click', () => {
			onClose(background);
		})
		cancelBtn.addEventListener('click', () => {
			onClose(background);
		})
		background.addEventListener('mousedown', e => {
			if (e.target === background && background.childElementCount === 1 && !modal.hasAttribute('data-loading')) {
				onClose(background);
			}
		})
		inputFields.forEach(field => {
			field.input.addEventListener('focus', () => {
				if (!field.input.value) {
					animateElement([
						{transform: 'translateY(10px)', fontSize: '1em'},
						{transform: 'translateY(6px)', fontSize: '.92em'},
						{transform: 'translateY(3px)', fontSize: '.84em'},
						{transform: 'translateY(0px)', fontSize: '.76em'},
					], field.label, 'normal', 80);
				}
			})
			field.input.addEventListener('blur', () => {
				if (!field.input.value) {
					animateElement([
						{transform: 'translateY(10px)', fontSize: '1em'},
						{transform: 'translateY(6px)', fontSize: '.92em'},
						{transform: 'translateY(3px)', fontSize: '.84em'},
						{transform: 'translateY(0px)', fontSize: '.76em'},
					], field.label, 'reverse', 80);
				}
			})
		})

		labelSurname.append(titleSurname);
		labelSurname.append(inputSurname);
		labelName.append(titleName);
		labelName.append(inputName);
		labelSecondName.append(titleSecondName);
		labelSecondName.append(inputSecondName);
		submitBtnWrapper.append(submitBtn);
		cancelBtnWrapper.append(cancelBtn);
		deleteBtnWrapper.append(deleteBtn);

		formHeadWrapper.append(labelSurname);
		formHeadWrapper.append(labelName);
		formHeadWrapper.append(labelSecondName);
		
		form.append(formHeadWrapper);
		form.append(contactSection);
		form.append(submitBtnWrapper);
		form.append(clientData.id ? deleteBtnWrapper : cancelBtnWrapper);

		closeModalBtn.append(closeModalBtnLineFirst);
		closeModalBtn.append(closeModalBtnLineSecond);
		modal.append(closeModalBtn);

		modal.append(modalTitle);
		modal.append(form);

		form.addEventListener('submit', async e => {
			e.preventDefault();
			
			const fields = modal.querySelectorAll('[data-field]');
			const contactList = document.querySelectorAll('.contact-form__field');
			const error = document.createElement('div');
			const loadingIcon = createLoadingSpinner(12, 12, '#fff');
			loadingIcon.style.marginRight = '9px';
			let isValid = true;
			
			error.classList.add('error-field');

			if (modal.querySelector('.error-field')) {
				modal.querySelector('.error-field').remove();
			}
			
			fields.forEach(element => {
				const label = {
					...(element.childNodes.length && {fieldName: element.childNodes[0]}),
					inputField: !element.childNodes.length ? element : element.childNodes[1],
				};
				isValid = validateInput(label, {errorWrapper: error, errorFlag: isValid});
			})
			if (!isValid) {
				contactSection.parentNode.insertBefore(error, contactSection.nextSibling);
				return;
			}

			let contactsArray = contactList ? extractContactsInfo(contactList) : [];

			disableInputs(modal);
			if (modal.querySelector('.contact-select__header')) modal.querySelector('.contact-select__header').style['pointer-events'] = 'none';

			modal.setAttribute('data-loading', 'pending');

			submitBtn.prepend(loadingIcon);

			await onSave({
				name: inputName.value,
				surname: inputSurname.value,
				lastName: inputSecondName.value,
				contacts: contactsArray,
			}, clientData);

			onClose(background);
		})
		
		deleteBtn.addEventListener('click', function() {
			const confirmationWindow = createConfirmationWindow({background, clientData, clientRow}, {onDelete, onClose});
			modal.setAttribute('style', 'display: none');
			background.append(confirmationWindow);
			focusTrap(background);
		})

		return modal;
	}

	function createContactsSection(contactsList = []) {
		function renderAddContactIcon(node) {
			const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
			const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	
			iconSvg.classList.add('clients-form__add--contact-icon');
			iconSvg.setAttribute('width', '14');
			iconSvg.setAttribute('height', '14');
			iconSvg.setAttribute('viewBox', "0 0 14 14");
			iconSvg.setAttribute('fill', 'none');
	
			iconPath.setAttribute('d', 'M6.99998 3.66683C6.63331 3.66683 6.33331 3.96683 6.33331 4.3335V6.3335H4.33331C3.96665 6.3335 3.66665 6.6335 3.66665 7.00016C3.66665 7.36683 3.96665 7.66683 4.33331 7.66683H6.33331V9.66683C6.33331 10.0335 6.63331 10.3335 6.99998 10.3335C7.36665 10.3335 7.66665 10.0335 7.66665 9.66683V7.66683H9.66665C10.0333 7.66683 10.3333 7.36683 10.3333 7.00016C10.3333 6.6335 10.0333 6.3335 9.66665 6.3335H7.66665V4.3335C7.66665 3.96683 7.36665 3.66683 6.99998 3.66683ZM6.99998 0.333496C3.31998 0.333496 0.333313 3.32016 0.333313 7.00016C0.333313 10.6802 3.31998 13.6668 6.99998 13.6668C10.68 13.6668 13.6666 10.6802 13.6666 7.00016C13.6666 3.32016 10.68 0.333496 6.99998 0.333496ZM6.99998 12.3335C4.05998 12.3335 1.66665 9.94016 1.66665 7.00016C1.66665 4.06016 4.05998 1.66683 6.99998 1.66683C9.93998 1.66683 12.3333 4.06016 12.3333 7.00016C12.3333 9.94016 9.93998 12.3335 6.99998 12.3335Z');
			iconPath.setAttribute('fill', '#9873FF');
	
			iconSvg.appendChild(iconPath);
	
			return node.prepend(iconSvg);
		}

		function createCustomSelect(contact) {
			function createSelectList() {
				const contactType = [
					{phone: 'Телефон'},
					{mail: 'Email'},
					{fb: 'Facebook'},
					{vk: 'VK'},
					{other: 'Другое'},
				];	
				const nodeList = [];

				contactType.forEach(object => {
					const listItem = document.createElement('li');
					const listText = document.createElement('span');
					listItem.classList.add('contact-select__item');
					listText.classList.add('contact-select__text', 'subtitle');
					
					for (let key in object) {
						listItem.setAttribute('data-contact', '');
						listItem.dataset.contact = key;
						listText.textContent = object[key];
						listItem.append(listText);

						if (contact.type === key) {
							listItem.classList.add('is-active');
							select.dataset.contact = key;
							selectHeaderText.textContent = object[key];
						} else if (listText.textContent === contactType[0][key] && !Object.keys(contact).length) {
							listItem.classList.add('is-active');
							select.dataset.contact = key;
							selectHeaderText.textContent = object[key];
						} 
					}
					nodeList.push(listItem);
				});

				return nodeList;
			}

			function renderSelectIcon(node) {
				const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
				const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

				iconSvg.classList.add('contact-select__ico');
				iconSvg.setAttribute('width', '10');
				iconSvg.setAttribute('height', '6');
				iconSvg.setAttribute('viewBox', "0 0 10 6");
				iconSvg.setAttribute('fill', 'none');

				iconPath.setAttribute('d', "M0.495029 0.690001C0.250029 0.935001 0.250029 1.33 0.495029 1.575L4.65003 5.73C4.84503 5.925 5.16003 5.925 5.35503 5.73L9.51003 1.575C9.75503 1.33 9.75503 0.935001 9.51003 0.690001C9.26503 0.445001 8.87003 0.445001 8.62503 0.690001L5.00003 4.31L1.37503 0.685002C1.13503 0.445002 0.735029 0.445001 0.495029 0.690001Z");
				iconPath.setAttribute('fill', '#9873FF');

				iconSvg.appendChild(iconPath);

				return node.appendChild(iconSvg);
			}

			function selectToggle() {
				document.querySelectorAll('.contact-select').forEach(select => {
					if (this.parentElement !== select) {
						select.classList.remove('is-active');
					}
				})
				this.parentElement.classList.toggle('is-active');
			}
		
			function selectChoose() {
				const text = this.textContent;
				const select = this.closest('.contact-select');
				const selectItem = this.closest('.contact-select__item');
				const currentText = this.closest('.contact-select').querySelector('.contact-select__current');
				
				select.setAttribute('data-contact', '');
				select.dataset.contact = selectItem.getAttribute('data-contact');
				currentText.textContent = text;
				
				itemsList.forEach(item => {
					item.classList.remove('is-active');
				})
				this.classList.add('is-active');
				select.classList.remove('is-active');
			}

			window.addEventListener('click', function(event) {
				if (!event.target.closest('.contact-select')) {
					document.querySelectorAll('.contact-select').forEach(item => {
						item.classList.remove('is-active');
					})
				}
			})

			const select = document.createElement('div');
			const selectHeader = document.createElement('div');
			const selectHeaderText = document.createElement('span');
			const selectBody = document.createElement('ul');
			const itemsList = createSelectList();
		
			select.classList.add('contact-select');
			selectHeader.classList.add('contact-select__header');
			selectHeaderText.classList.add('contact-select__current', 'subtitle');
			selectBody.classList.add('contact-select__body', 'list-reset');

			selectHeader.addEventListener('click', selectToggle);

			itemsList.forEach(item => {
				item.addEventListener('click', selectChoose);
			})

			selectHeader.append(selectHeaderText);
			renderSelectIcon(selectHeader);
			itemsList.forEach(item => {
				selectBody.append(item);
			})
			select.append(selectHeader);
			select.append(selectBody);

			return select;
		}
		
		function renderDeleteInputButton(node) {
			const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
			const iconPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');

			iconSvg.classList.add('contact-form__input-close-icon');
			iconSvg.setAttribute('width', '12');
			iconSvg.setAttribute('height', '12');
			iconSvg.setAttribute('viewBox', '0 0 12 12');
			iconSvg.setAttribute('fill', 'none');

			iconPath.setAttribute('d', "M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z");
			iconPath.setAttribute('fill', '#B0B0B0');

			iconSvg.appendChild(iconPath);

			return node.append(iconSvg);
		}

		function animateContactFieldAppend(parent, child, delay) {
			animateElement([
				{heigth: '0px'},
				{heigth: '10px'},
				{heigth: '20px'},
				{heigth: '30px'},
				{heigth: '36px'},
				{heigth: 'auto'},
			], parent, 'normal', delay);
			
			setTimeout(() => {
				parent.classList.add('contact-fade-in');
				child.classList.add('contact-form-input-fade-in');
			}, delay)
		}

		function animateInnerFieldRemoval(element, heightProperty) {
			const rules = [];

			element.replaceChildren();
			element.style.heigth = heightProperty;

			for (let i = parseInt(heightProperty); i >= 0; i--) {
				rules.push({'heigth': `${i}`});
			}

			animateElement(rules, element, 'normal', 250)
		}

		function renderContactField(contact = {}) {
			const field = document.createElement('div');
			const input = document.createElement('input');
			const inputWrapper = document.createElement('div');
			const btnClose = document.createElement('button');

			inputWrapper.classList.add('contact-form__input-wrapper');
			input.classList.add('contact-form__input', 'text');
			btnClose.classList.add('contact-form__input-btn', 'btn-reset');
			field.classList.add('contact-form__field');

			input.setAttribute('data-field', 'required-contact');

			animateContactFieldAppend(field, input, 85);

			btnClose.type = 'button';
			input.placeholder = 'Введите данные контакта';
			
			input.value = contact.value || '';

			inputWrapper.append(input);
			renderDeleteInputButton(btnClose);
			inputWrapper.append(btnClose);
			field.append(createCustomSelect(contact));
			field.append(inputWrapper);
			fieldWrapper.append(field);

			!input.value ? btnClose.classList.remove('is-active') : btnClose.classList.add('is-active');

			if (fieldWrapper.childElementCount === 1) {
				wrapper.classList.remove('clients-form__contact-wrapper--squeeze');
				wrapper.classList.add('clients-form__contact-wrapper--extended');
			}

			if (fieldWrapper.childElementCount >= 10) {
				contactAddBtn.remove();
			}

			input.addEventListener('input', () => {
				if (!input.value) {
					btnClose.classList.remove('is-active');
					return;
				}
				btnClose.classList.add('is-active');
			})
			
			btnClose.addEventListener('click', () => {
				const innerFormField = btnClose.closest('.contact-form__field');
				const innerFormFieldHeigth = window.getComputedStyle(innerFormField).getPropertyValue("height");

				innerFormField.setAttribute('data-to-be-remvoed', '');
				setTimeout(() => {
					innerFormField.remove();
				}, 200)

				innerFormField.classList.add('contact-form__field--slide');
				if (fieldWrapper.childElementCount === 1 && innerFormField.hasAttribute('data-to-be-remvoed')) {
          wrapper.classList.remove("clients-form__contact-wrapper--extended");
          wrapper.classList.add("clients-form__contact-wrapper--squeeze");
        }
				
				animateInnerFieldRemoval(innerFormField, innerFormFieldHeigth);

				if (!wrapper.contains(contactAddBtn)) wrapper.append(contactAddBtn);
			})
		}

		const wrapper = document.createElement('div');
		const fieldWrapper = document.createElement('div');
		const contactAddBtn = document.createElement('button');

		contactAddBtn.classList.add('clients-form__add-contact', 'btn-reset');
		fieldWrapper.classList.add('clients-form__wrapper');
		wrapper.classList.add('clients-form__contact-wrapper');
		contactAddBtn.type = 'button';
		contactAddBtn.textContent = 'Добавить контакт';

		contactsList.forEach(contact => {
			renderContactField(contact);
		})
		
		contactAddBtn.addEventListener('click', () => {
			renderContactField();
		});

		renderAddContactIcon(contactAddBtn);
		wrapper.append(fieldWrapper);
		
		if (fieldWrapper.childElementCount < 10) {
			wrapper.append(contactAddBtn);
		}

		return wrapper;
	}

	function createConfirmationWindow({background, clientData, clientRow}, {onDelete, onClose}) {
		function closeModal() {
			if (background.childNodes.length > 1) {
				modal.remove();
				document.querySelector('.modal-wrapper').setAttribute('style', 'display: block');
				focusTrap(background);
				return;
			}
			onClose(background);
		}

		const modal = document.createElement('div');
		const title = document.createElement('h2');
		const descr = document.createElement('p');
		const btnWrapper = document.createElement('div');
		const confirmBtn = document.createElement('button');
		const cancelBtn = document.createElement('button');
		const closeBtn = document.createElement('button');
		const closeBtnLineFirst = document.createElement('span');
		const closeBtnLineSecond = document.createElement('span');

		modal.classList.add('modal-wrapper', 'contact-confirm');
		title.classList.add('contact-confirm__title', 'title');
		descr.classList.add('contact-confirm__descr', 'text');
		closeBtn.classList.add('modal-wrapper__close', 'btn-reset', 'contact-confirm__close');
		btnWrapper.classList.add('contact-confirm__buttons');
		confirmBtn.classList.add('contact-confirm__submit', 'clients-submit-btn', 'btn-reset');
		cancelBtn.classList.add('clients-delete-btn', 'btn-reset');

		title.textContent = 'Удалить контент';
		descr.textContent = 'Вы действительно хотите удалить данного клиента?';
		confirmBtn.textContent = 'Удалить';
		cancelBtn.textContent = 'Отмена';

		confirmBtn.addEventListener('click', async () => {
			const loadingIcon = createLoadingSpinner(12, 12, '#fff');
			loadingIcon.style.marginRight = '9px';

			background.setAttribute('data-confirm-loading', 'pending');
			disableInputs(modal);

			confirmBtn.prepend(loadingIcon);

			await onDelete({clientData, clientRow});
			onClose(background);
		})
		closeBtn.addEventListener('click', () => {
			closeModal();
		});
		cancelBtn.addEventListener('click', () => {
			closeModal();
		})
		background.addEventListener('mousedown', e => {
			if (e.target === background && !background.hasAttribute('data-confirm-loading')) {
				closeModal();
			}
		})

		closeBtn.append(closeBtnLineFirst);
		closeBtn.append(closeBtnLineSecond);
		btnWrapper.append(confirmBtn);
		btnWrapper.append(cancelBtn);
		modal.append(closeBtn);
		modal.append(title);
		modal.append(descr);
		modal.append(btnWrapper);

		focusTrap(modal);

		return modal;
	}

	function createClientAddButton() {
		function renderClientAddButtonIcon(node) {
			const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const pathSvg = document.createElementNS('http://www.w3.org/2000/svg', 'path');

			iconSvg.classList.add('btn-add__icon');
			iconSvg.setAttribute('width', '23');
			iconSvg.setAttribute('height', '16');
			iconSvg.setAttribute('viewBox', '0 0 23 16');
			iconSvg.setAttribute('fill', 'none');

			pathSvg.setAttribute('d', "M14.5 8C16.71 8 18.5 6.21 18.5 4C18.5 1.79 16.71 0 14.5 0C12.29 0 10.5 1.79 10.5 4C10.5 6.21 12.29 8 14.5 8ZM5.5 6V3H3.5V6H0.5V8H3.5V11H5.5V8H8.5V6H5.5ZM14.5 10C11.83 10 6.5 11.34 6.5 14V16H22.5V14C22.5 11.34 17.17 10 14.5 10Z");
			pathSvg.setAttribute('fill', '#9873FF');

			iconSvg.appendChild(pathSvg);

			return node.appendChild(iconSvg);
		}
		
		const wrapper = document.createElement('div');
		const btn = document.createElement('button');
		const btnText = document.createElement('span');

		btn.classList.add('btn-add', 'btn-reset');
		wrapper.classList.add('btn-wrapper');
		btnText.classList.add('btn-add__text', 'text');

		btn.setAttribute('data-control', 'button');

		btnText.textContent = 'Добавить Клиента';
		
		renderClientAddButtonIcon(btn);
		btn.append(btnText);
		wrapper.append(btn);

		return {
			wrapper,
			btn,
		}
	}

	function adjustClasses(array, ...classes) {
		array.forEach(item => {
			item.classList.add(...classes);
		})
	}

	function appendElements(arrayOfChildren, parentNode) {
		arrayOfChildren.forEach(child=> {
			parentNode.appendChild(child);
		})
	}

	function extractContactsInfo(node) {
		const contactsArray = [];
		node.forEach(element => {
			contactsArray.push({
				type: element.querySelector('.contact-select').getAttribute('data-contact'),
				value: element.querySelector('.contact-form__input').value});
		})
		return contactsArray;
	}

	function animateElement(animateRules, nodeToAnimate, animDirection, animDuration, animDelay = '0') {
		nodeToAnimate.animate(animateRules,
			{	direction: animDirection,
				fill: 'forwards',
				duration: animDuration,
				animDelay,
			}
		)
	}

	function renderModalWindow({modalBgFunc = createModalWrapper, modalWindowFunc, eventHandlers, clientData, clientRow}) {
		const background = modalBgFunc();
		const modal = modalWindowFunc({background, clientData, clientRow}, eventHandlers);
		background.append(modal);

		return background;
	}

	function validateInput({fieldName = 'Контактов', inputField}, {errorWrapper, errorFlag}) {
		// Поля Имя и Фамилия обязательны (затримить поля перед валидацией)
		// Поле контакта, если он есть должно быть заполнено 
		// При непрохождении валидации закинуть сообщения об ошибках над кнопкой отправки, непрошедшие валидацию поля подсветить красным
		// на поле вешается слушатель типа input
		const errorsMap = {
			inputReq: (typeof fieldName === 'object') ? `Поле ${fieldName.textContent} должно быть заполнено` : `Поля ${fieldName} должны быть заполнены`,
		};

		if (!inputField.value.trim()) {
			const errorContent = document.createElement('span');
			errorContent.classList.add('error-field__message');
			errorContent.textContent = errorsMap.inputReq;
			if (typeof fieldName !== 'object') {
				errorContent.setAttribute('data-error', 'contact-message');
			}
			if (!errorWrapper.querySelectorAll('[data-error]').length) {
				errorWrapper.append(errorContent);
			}

			if (typeof fieldName === 'object') {
				inputField.parentNode.classList.add('error-input');
			} else {
				inputField.classList.add('error-input');
			}

			inputField.addEventListener('input', () => {
				if (inputField.value.trim()) {
					errorContent.remove();
					if (typeof fieldName === 'object') {
						inputField.parentNode.classList.remove('error-input');
					} else {
						inputField.classList.remove('error-input');
					}
				}
			})

			if (errorFlag) return !errorFlag;
		}

		return errorFlag;
	}

	function createLoadingSpinner(w, h, color = '#9873FF') {
		const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const pathSvg = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		iconSvg.classList.add('table-spinner-preloader__icon', 'spinning-animation');
		iconSvg.setAttribute('width', `${w}`);
		iconSvg.setAttribute('height', `${h}`);
		iconSvg.setAttribute('viewBox', '0 0 80 80');
		iconSvg.setAttribute('fill', 'none');

		pathSvg.setAttribute('d', "M4.00025 40.0005C4.00025 59.8825 20.1182 76.0005 40.0002 76.0005C59.8822 76.0005 76.0002 59.8825 76.0002 40.0005C76.0002 20.1185 59.8823 4.00049 40.0003 4.00049C35.3513 4.00048 30.9082 4.88148 26.8282 6.48648");
		pathSvg.setAttribute('stroke', `${color}`);
		pathSvg.setAttribute('stroke-width', '8');
		pathSvg.setAttribute('stroke-miterlimit', '10');
		pathSvg.setAttribute('stroke-linecap', 'round');

		iconSvg.appendChild(pathSvg);

		return iconSvg;
	}

	function focusTrap(element) {
		const KEYCODE_TAB = 9;
		let focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
		let firstFocusableEl = focusableEls[0];
		let lastFocusableEl = focusableEls[focusableEls.length - 1];

		firstFocusableEl.focus();

		element.addEventListener('keydown', function(e) {
			let isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

			if (!isTabPressed) {
				return;
			}

			if (e.shiftKey) {
				if (document.activeElement === firstFocusableEl) {
					lastFocusableEl.focus();
					e.preventDefault();
				}
			} else {
				if (document.activeElement === lastFocusableEl) {
					firstFocusableEl.focus();
					e.preventDefault();
				}
			}
		})
	}

	function disableInputs(element) {
		element.querySelectorAll('button, input').forEach(el => {
			el.setAttribute('disabled', 'disabled');
		});
	}

	document.addEventListener('DOMContentLoaded', async () => {
		async function loadClients(clientId = '') {
			const response = await fetch(`http://localhost:3000/api/clients/${clientId}`);
			const data = await response.json();
			return data;
		}

		const eventHandlers = {
			async onSave(clientInfo, clientData) {
				if (clientData.id) {
					await fetch(`http://localhost:3000/api/clients/${clientData.id}`, {
						method: 'PATCH',
						body: JSON.stringify(clientInfo),
						headers: {
							'Content-Type': 'application/json',
						}
					})
				} else {
					await fetch('http://localhost:3000/api/clients', {
						method: 'POST',
						body: JSON.stringify(clientInfo),
						headers: {
							'Content-Type': 'application/json',
						}
					})
				}
				sortClientData({method: true});
			},
			async onChange({clientId, clientRow}) {
				let clientData = await loadClients(clientId);
				const editModal = renderModalWindow({modalWindowFunc: createModalWindow, clientData, eventHandlers, clientRow});
				document.body.append(editModal);
				focusTrap(editModal);
				editModal.classList.add('modal--active');
			},
			async onDelete({clientData, clientRow}) {
				clientRow.remove();
				await fetch(`http://localhost:3000/api/clients/${clientData.id}`, {
					method: 'DELETE',
				})
				sortClientData({method: true});
			},
			onClose(element) {
				setTimeout(() => element.remove(), 200);
				element.classList.remove('modal--active');
			},
		}

		function renderClients(clientsData) {
			console.log('rendered');
			tableBody.loadingRow.remove();
      clientsData.forEach((client) => {
				tableBody.body.append(createClientRow(client, eventHandlers));
      });
    }

		function clearClients(node) {
			node.replaceChildren();
		}

		function renderClientsTable() {
			table.append(tableHead.tableHead);
			table.append(tableBody.body);
			tableWrapper.append(table);
			container.append(tableWrapper);
			container.append(addClient.wrapper);
			main.append(container);
		}

		async function sortClientData({searchParam = '', method = ''} = {}) {
			const rotateIcon = () => {
				if (searchParam || method) return;
				tableHead.buttons.forEach(btn => {
					if (btn !== this) {
						btn.querySelector('.clients-table__text').classList.remove('active-sort');
						btn.querySelector('.clients-table__ico').classList.add('rotate');
						if (btn.dataset.sortby === 'fullname') {
							btn.querySelector('.clients-table__sort-help').innerHTML = 'Я&#8209;А';
						}
					}
				})
				this.querySelector('.clients-table__text').classList.remove('active-sort');
				this.querySelector('.clients-table__text').classList.add('active-sort');
				this.querySelector('.clients-table__ico').classList.toggle('rotate');
				if (this.dataset.sortby === 'fullname') {
					let currentHelper = this.querySelector('.clients-table__sort-help');
					currentHelper = (currentHelper.innerHTML.slice(0, 1) === 'Я') ? currentHelper.innerHTML = 'А&#8209;Я' : currentHelper.innerHTML = 'Я&#8209;А';
				}
			}
			const changeSortOrder = () => {
				if (searchParam || method) return;
				tableHead.buttons.forEach(btn => {
					if (btn !== this) btn.dataset.sortorder = 'decreased';
				})
				this.dataset.sortorder = (this.dataset.sortorder === 'increased') ? 'decreased' : 'increased';
			}

			document.querySelectorAll('[data-control]').forEach(button => {
				button.setAttribute('disabled', 'disabled');
			})

			clearClients(tableBody.body);
			tableBody.body.append(tableBody.loadingRow);
			let currentInput = `?search=${searchField.value}`;
			let data = await loadClients(searchParam ? searchParam : currentInput ? currentInput : searchParam);
			let dataCopy = [...data];
			let currentSort;

			if (method || searchParam ? document.querySelector('.active-sort').parentElement.dataset.sortby === 'fullname' : this.dataset.sortby === 'fullname') {
				changeSortOrder();
				rotateIcon();
				currentSort = document.querySelector('.active-sort').parentElement.dataset;
				console.log(currentSort.sortorder === 'increased');
				dataCopy.sort((a, b) => {
					a = `${a.surname.toLowerCase()} ${a.name.toLowerCase()} ${a.lastName.toLowerCase()}`;
					b = `${b.surname.toLowerCase()} ${b.name.toLowerCase()} ${b.lastName.toLowerCase()}`;
					return searchParam || method ?
						(currentSort.sortorder === 'increased' ?
							a > b ? 1 : -1 : b > a ? 1 : -1) :
						(this.dataset.sortorder === 'increased' ?
							a > b ? 1 : -1 : b > a ? 1 : -1);
				});
				console.log('имя')
			} else if (method || searchParam ? document.querySelector('.active-sort').parentElement.dataset.sortby === 'id' : this.dataset.sortby === 'id') {
				changeSortOrder();
				rotateIcon();
				currentSort = document.querySelector('.active-sort').parentElement.dataset
				console.log(currentSort.sortorder === 'increased');
				dataCopy.sort((a, b) => {
					return searchParam || method ? 
						(currentSort.sortorder === 'increased' ?
							a.id > b.id ? 1 : -1 : b.id > a.id ? 1 : -1) :
						(this.dataset.sortorder === 'increased' ?
							a.id > b.id ? 1 : -1 : b.id > a.id ? 1 : -1);
				});
				console.log('айди')
			} else {
				changeSortOrder();
				rotateIcon();
				currentSort = document.querySelector('.active-sort').parentElement.dataset;
				console.log(currentSort.sortorder === 'increased');
				dataCopy.sort((a, b) => {
					return searchParam || method ?
						(currentSort.sortorder === 'increased' ?
							new Date(a[currentSort.sortby]) > new Date(b[currentSort.sortby]) ? 1 : -1 :
							new Date(b[currentSort.sortby]) > new Date(a[currentSort.sortby]) ? 1 : -1) : 
						(this.dataset.sortorder === 'increased' ?
							new Date(a[this.dataset.sortby]) > new Date(b[this.dataset.sortby]) ? 1 : -1 :
							new Date(b[this.dataset.sortby]) > new Date(a[this.dataset.sortby]) ? 1 : -1);
				});
				console.log('все остальное')
			}
			renderClients(dataCopy);

			document.querySelectorAll('[data-control]').forEach(button => {
				button.removeAttribute('disabled');
			})
			
			if (searchParam) searchField.focus();
		}

		function searchClientData() {
			let timerId;
			return function() {
				clearTimeout(timerId);
				timerId = setTimeout(async () => {
					sortClientData({searchParam: `?search=${this.value}`});
				}, 300)
			}
		}

		const main = document.querySelector('.clients');
		const container = createContainer();
		const tableWrapper = createTableWrapper();
		const table = createTable();
		const tableHead = createTableHead();
		const tableBody = createTableBody();
		const addClient = createClientAddButton();
		const searchForm = document.querySelector('.search');
		const searchField = document.querySelector('.search__field');

		renderClientsTable();
		const clientsData = await loadClients(); 
		renderClients(clientsData);
		searchField.removeAttribute('disabled');

		searchForm.addEventListener('submit', e => {
			e.preventDefault();
		})

		searchField.addEventListener('input', searchClientData());

		tableHead.buttons.forEach(btn => {
			btn.addEventListener('click', function () {
				sortClientData.apply(this);
			})
		})
		
		addClient.btn.addEventListener('click', () => {
			const modal = renderModalWindow({modalWindowFunc: createModalWindow, eventHandlers});
			document.body.append(modal);
			focusTrap(modal);
			modal.classList.add('modal--active');
		})
	})
})()


/* 1) добавить хуверы и прочие состояния где надо
	2) оптимизировать функции svg
	3) ???*/