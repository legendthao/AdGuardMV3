import React, {
    useContext,
    useEffect,
    useState,
} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';

import { translator } from 'Common/translators/translator';
import { FiltersGroupId, QUERY_PARAM_NAMES } from 'Common/constants';
import { Section, Header } from 'Common/components/Section';
import { IconId } from 'Common/components/ui';
import { rootStore } from 'Options/stores';
import { CustomFilterModal } from 'Options/components/Filters/CustomFilterModal';
import { CheckboxOption } from 'Options/components/CheckboxOption';
import { Button } from 'Common/components/Button/Button';

import styles from './Filters.module.pcss';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export const Filters = observer(() => {
    const history = useHistory();

    const {
        settingsStore,
        searchStore,
        customFilterModalStore,
    } = useContext(rootStore);

    const {
        openModal,
        closeModal,
    } = customFilterModalStore;

    const {
        openSearch,
        closeSearch,
        matchesSearchQuery,
        setSearchValue,
    } = searchStore;

    const {
        disableFilter,
        enableFilter,
    } = settingsStore;

    useEffect(() => {
        return searchStore.closeSearch;
    }, []);

    const { filters } = settingsStore;

    const query = useQuery();

    const [urlToSubscribe, setUrlToSubscribe] = useState(decodeURIComponent(query.get(QUERY_PARAM_NAMES.SUBSCRIBE) || ''));
    const [customFilterTitle, setCustomFilterTitle] = useState(
        query.get(QUERY_PARAM_NAMES.TITLE),
    );

    const filtersByGroupId = filters
        .filter((filter) => filter.groupId === FiltersGroupId.CUSTOM)
        .filter((filter) => matchesSearchQuery(filter.title));

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value);
    };

    const handleClickToFilter = (id: number) => {
        customFilterModalStore.openRemoveCustomFilterModal(id);
    };

    const closeModalHandler = () => {
        setUrlToSubscribe('');
        setCustomFilterTitle('');
        closeModal();

        // clear querystring params
        if (query.has(QUERY_PARAM_NAMES.TITLE) || query.has(QUERY_PARAM_NAMES.SUBSCRIBE)) {
            query.delete(QUERY_PARAM_NAMES.TITLE);
            query.delete(QUERY_PARAM_NAMES.SUBSCRIBE);
            history.push(`${history.location.pathname}?${decodeURIComponent(query.toString())}`);
        }
    };

    useEffect(() => {
        if (urlToSubscribe) {
            openModal();
        }
    }, [urlToSubscribe, openModal]);

    return (
        <>
            <CustomFilterModal
                initialTitle={customFilterTitle}
                urlToSubscribe={urlToSubscribe}
                setUrlToSubscribe={setUrlToSubscribe}
                isOpen={customFilterModalStore.isModalOpen}
                closeHandler={closeModalHandler}
            />
            <Section
                header={(
                    <Header
                        isOpen={searchStore.isSearchOpen}
                        handleBackClick={closeSearch}
                        handleSearchClick={openSearch}
                        handleCloseSearchClick={closeSearch}
                        handleSearchInputChange={handleSearchInputChange}
                        searchValue={searchStore.searchValue}
                        pageTitle={translator.getMessage('options_custom_filters_option')}
                    />
                )}
            >
                <Button
                    icon={IconId.PLUS}
                    handleClick={openModal}
                    message={translator.getMessage('options_add_custom_filter')}
                />
                <div className={styles.container}>
                    {filtersByGroupId?.length > 0
                        ? filtersByGroupId.map((filter) => {
                            const onChange = async () => {
                                if (filter.enabled) {
                                    await disableFilter(filter.id);
                                } else {
                                    await enableFilter(filter.id);
                                }
                            };

                            return (
                                <CheckboxOption
                                    iconId={IconId.CUSTOM_FILTERS}
                                    key={filter.id}
                                    id={filter.id.toString()}
                                    message={filter.title}
                                    checked={filter.enabled}
                                    onClick={() => { handleClickToFilter(filter.id); }}
                                    onChange={onChange}
                                />
                            );
                        })
                        : <div className={styles.notFound}>{translator.getMessage('options_filters_not_found')}</div>}
                </div>
            </Section>
        </>
    );
});
